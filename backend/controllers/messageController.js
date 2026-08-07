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

  // Remove sender from deletedFor if they previously deleted
  // this conversation
  // conversation.deletedFor = conversation.deletedFor.filter(
  //   (item) => item.user.toString() !== senderId.toString(),
  // );

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
  const userId = req.user._id;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.user._id,
  });

  if (!conversation) {
    return next(new AppError("Conversation not found.", 404));
  }

  const deletedRecord = conversation.deletedFor.find(
    (item) => item.user.toString() === userId.toString(),
  );

  // Base query
  const messageQuery = {
    conversationId,
    // Hide messages that were individually deleted for this user
    deletedFor: {
      $ne: userId,
    },
  };

  // If the user deleted the conversation,
  // only show messages created after that deletion
  if (deletedRecord) {
    messageQuery.createdAt = {
      $gt: deletedRecord.deletedAt,
    };
  }

  const messages = await Message.find(messageQuery)
    .populate("sender", "name email profilePicture")
    .populate("receiver", "name email profilePicture")
    .sort("createdAt");

  res.status(200).json({
    status: "success",
    result: messages.length,
    data: messages,
  });
});

export const deleteMessageForEveryone = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  if (message.isDeleted) {
    return next(new AppError("Message is already deleted", 400));
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not eligible to delete this message", 403),
    );
  }

  const deletedMessage = await Message.findByIdAndUpdate(
    messageId,
    {
      isDeleted: true,
      deletedAt: new Date(),
      messageType: "deleted",
      text: "",
      image: "",
      video: "",
      file: "",
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  const io = getIo();

  emitToUser(io, message.sender, "message-deleted-to-everyone", deletedMessage);

  emitToUser(
    io,
    message.receiver,
    "message-deleted-to-everyone",
    deletedMessage,
  );

  return res.status(200).json({
    status: "success",
    data: deletedMessage,
  });
});

export const deleteMessageForMe = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  const isParticipant =
    message.sender.toString() === userId.toString() ||
    message.receiver.toString() === userId.toString();

  if (!isParticipant) {
    return next(
      new AppError("You are not allowed to delete this message", 403),
    );
  }

  const deletedMessage = await Message.findByIdAndUpdate(messageId, {
    $addToSet: { deletedFor: userId },
  });

  const io = getIo();

  emitToUser(io, userId, "delete-message-for-me", deletedMessage);

  res.status(200).json({
    status: "success",
    data: deletedMessage,
  });
});
