import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { getIo, onlineUsers } from "../sockets/socket.js";
import { emitToUser } from "../sockets/emit.js";

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
  conversation.lastMessageSender = req.user._id;
  conversation.lastMessageAt = message.createdAt;

  await conversation.save();

  const io = getIo();

  emitToUser(io, receiverId, "receive-message", message);

  res.status(201).json({
    status: "success",
    data: message,
  });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;

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

// export const seenMessage = catchAsync(async (req, res, next) => {
//   const { messageId } = req.params;

//   const message = await Message.findByIdAndUpdate(
//     messageId,
//     { isSeen: true },
//     { runValidators: true, returnDocument: "after" },
//   );

//   if (!message) {
//     return next(new AppError("Message not found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: message,
//   });
// });

export const seenMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new AppError("Message not found", 404));
  }

  if (message.receiver.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not eligible to mark this message as seen", 403),
    );
  }

  if (!message.isSeen) {
    await Message.updateMany(
      {
        conversationId: message.conversationId,
        receiver: req.user._id,
        sender: message.sender,
        isSeen: false,
      },
      {
        isSeen: true,
        seenAt: new Date(),
      },
    );

    message.isSeen = true;
    message.seenAt = new Date();
    await message.save();
  }

  const io = getIo();
  emitToUser(io, message.sender, "message-seen", {
    conversationId: message.conversationId,
    messageId: message._id,
    seenAt: message.seenAt,
  });

  res.status(200).json({
    status: "success",
    data: message,
  });
});
