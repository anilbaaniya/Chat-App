import api from "./api";

export const getConversations = async () => {
  try {
    return api.get("/conversations/");
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
