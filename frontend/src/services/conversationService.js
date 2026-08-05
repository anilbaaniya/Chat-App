import api from "./api";

export const getConversations = async () => {
  try {
    return await api.get("/conversations/");
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const createConversation = async (receiverId) => {
  console.log(receiverId);
  try {
    return await api.post("/conversations/", { receiverId });
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
