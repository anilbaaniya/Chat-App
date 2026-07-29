import api from "./api";

export const getConversations = async () => {
  try {
    return api.get("/conversations/");
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const createConversation = async (receiverId) => {
  console.log(receiverId);
  try {
    return api.post("/conversations/", { receiverId });
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
