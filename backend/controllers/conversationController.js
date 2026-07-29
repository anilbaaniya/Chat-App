import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getIo } from "../sockets/socket.js";
import { emitToUser } from "../sockets/emit.js";

// Create a Conversation
export const createConversation = catchAsync(async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return next(new AppError("Receiver id is required", 400));
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  }).populate("participants", "name email profilePicture");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    // 🔥 Populate after creating
    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "name email profilePicture",
    );
  }

  const receiver = conversation.participants.find(
    (participant) => participant._id.toString() !== senderId.toString(),
  );

  res.status(200).json({
    status: "success",
    data: {
      ...conversation.toObject(),
      user: receiver,
    },
  });
});

// Get Single Conversation
export const getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(
    req.params.conversationId,
  ).populate("participants", "name email profilePicture");

  if (!conversation) {
    return res.status(400).json({
      status: "fail",
      message: "Conversation not found.",
    });
  }

  res.status(200).json({
    status: "success",
    data: conversation,
  });
});

// Get all the conversations
export const getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "name email profilePicture")
    .populate("lastMessage")
    .sort("-lastMessageAt");

  const formattedConversations = conversations.map((conversation) => {
    // Find the other participant (not the logged-in user)
    const otherUser = conversation.participants.find(
      (participant) => participant._id.toString() !== req.user._id.toString(),
    );

    return {
      _id: conversation._id,

      user: otherUser,

      lastMessage: conversation.lastMessage,

      lastMessageAt: conversation.lastMessageAt,

      unreadCount: conversation.unreadCount?.[req.user._id.toString()] ?? 0,

      updatedAt: conversation.updatedAt,

      createdAt: conversation.createdAt,
    };
  });

  res.status(200).json({
    status: "success",
    result: formattedConversations.length,
    data: formattedConversations,
  });
});

export const markConversationAsSeen = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

  // 1. Check conversation exists
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new AppError("Conversation not found", 404));
  }

  // 2. Check current user is participant
  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === req.user._id.toString(),
  );

  if (!isParticipant) {
    return next(
      new AppError("You are not allowed to access this conversation", 403),
    );
  }

  // 3. Find unread messages received by current user
  const unreadMessages = await Message.find({
    conversationId,
    receiver: req.user._id,
    isSeen: false,
  }).select("_id sender");

  if (unreadMessages.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No unread messages",
    });
  }

  const seenAt = new Date();

  // 4. Mark all as seen
  await Message.updateMany(
    {
      conversationId,
      receiver: req.user._id,
      isSeen: false,
    },
    {
      $set: {
        isSeen: true,
        seenAt,
      },
    },
  );

  // 5. In one-to-one chat, all unread messages have the same sender
  const senderId = unreadMessages[0].sender.toString();

  // 6. Notify sender
  const io = getIo();

  emitToUser(io, senderId, "messages-seen", {
    conversationId,
    messageIds: unreadMessages.map((msg) => msg._id),
    seenAt,
  });

  // 7. Response
  res.status(200).json({
    status: "success",
    message: "Messages marked as seen",
    data: {
      conversationId,
      messageIds: unreadMessages.map((msg) => msg._id),
      seenAt,
    },
  });
});
