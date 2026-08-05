import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { getIo, onlineUsers } from "../sockets/socket.js";
import { emitToUser } from "../sockets/emit.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverId, text, image, file, messageType, video } = req.body;

  // find existing conversation
  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  // Create conversation if not exist
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // Create message
  let message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    receiver: receiverId,
    text,
    image,
    file,
    video,
    messageType,
  });

  // Populate sender and receiver

  await message.populate([
    { path: "sender", select: "name email profilePicture" },
    { path: "receiver", select: "name email profilePicture" },
  ]);

  // Update last message
  conversation.lastMessage = message._id;
  conversation.lastMessageSender = req.user._id;
  conversation.lastMessageAt = message.createdAt;

  if (!(conversation.unreadCount instanceof Map)) {
    conversation.unreadCount = new Map(
      Object.entries(conversation.unreadCount || {}),
    );
  }

  const receiverUnread =
    conversation.unreadCount.get(receiverId.toString()) || 0;

  conversation.unreadCount.set(receiverId.toString(), receiverUnread + 1);

  // Sender should never have unread messages in this conversation
  conversation.unreadCount.set(senderId.toString(), 0);

  await conversation.save();

  const io = getIo();

  emitToUser(io, receiverId, "receive-message", message);

  // Notify both users to refresh their conversation list
  emitToUser(io, senderId, "conversation-updated");

  emitToUser(io, receiverId.toString(), "conversation-updated");

  emitToUser(io, receiverId.toString(), "unreadMessages-updated", {
    conversationId: conversation._id,
    lastMessage: message,
    unreadCount: conversation.unreadCount.get(receiverId.toString()),
  });

  res.status(201).json({
    status: "success",
    data: message,
  });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    return next(new AppError("Conversation not found.", 404));
  }

  const messages = await Message.find({ conversationId })
    .populate("sender", "name email profilePicture")
    .populate("receiver", "name email profilePicture")
    .sort("createdAt");

  res.status(200).json({
    status: "success",
    result: messages.length,
    data: messages,
  });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not eligible to delete this message", 403),
    );
  }

  await message.deleteOne();

  res.status(200).json({
    status: "success",
    data: "Message deleted successfully",
  });
});
