import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  const senderId = req.user._id;
  const { receiverId, text, image, file, messageType } = req.body;

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
  const message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    receiver: receiverId,
    text,
    image,
    file,
    messageType,
  });

  // Update last message
  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json({
    status: "success",
    data: message,
  });
});

export const getMessages = catchAsync(async (req, res, next) => {});
