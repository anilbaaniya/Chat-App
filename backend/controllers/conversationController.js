import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Conversation } from "../models/conversationModel.js";

// Create a Conversation
export const createConversation = catchAsync(async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return next(new AppError("Receiver id is required", 400));
  }

  // check whether the conversation already existed
  let conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (conversation) {
    return res.status(200).json({
      status: "success",
      data: conversation,
    });
  }

  // Create new conversation
  conversation = await Conversation.create({
    participants: [senderId, receiverId],
  });

  res.status(200).json({
    status: "success",
    data: conversation,
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
    .sort("-updatedAt");

  res.status(200).json({
    status: "success",
    result: conversations.length,
    data: conversations,
  });
});
