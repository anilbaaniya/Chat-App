import api from "./api";

export const searchUser = async (search) => {
  try {
    return await api.get(`/users?search=${search}`);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const updateUser = async (data) => {
  try {
    return await api.patch(`/users/updateMe`, data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
