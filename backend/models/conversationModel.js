import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },

    deletedFor: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        deletedAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true },
);

// Find all conversations of a user quickly
conversationSchema.index({ participants: 1 });

// Sort conversations by latest activity efficiently
conversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
