import api from "./api";

export const searchUser = async (search) => {
  try {
    return api.get(`/users?search=${search}`);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
