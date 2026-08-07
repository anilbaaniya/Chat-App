import api from "./api";

export const sendMessage = async (data) => {
  try {
    return await api.post("/messages/", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    return await api.get(`/messages/${conversationId}`);
  } catch (error) {
    console.log(error.response);
    if (error.response) throw error.response;
    throw error;
  }
};

export const markSeenMessage = async (messageId) => {
  try {
    return await api.patch(`/conversations/${messageId}/seen`);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const deleteMessageForEveryone = async (messageId) => {
  try {
    return await api.patch(`/messages/${messageId}/delete-for-everyone`, {});
  } catch (error) {
    console.log(error.response);
    if (error.response) throw error.response;
    throw error;
  }
};

export const deleteMessageForMe = async (messageId) => {
  try {
    return await api.patch(`/messages/${messageId}/delete-for-me`, {});
  } catch (error) {
    console.log(error.response);
    if (error.response) throw error.response;
    throw error;
  }
};
