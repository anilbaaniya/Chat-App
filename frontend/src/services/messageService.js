import api from "./api";

export const sendMessage = async (data) => {
  try {
    return api.post("/messages/", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    return api.get(`/messages/${conversationId}`);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
