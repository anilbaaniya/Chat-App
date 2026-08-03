import api from "./api";

export const searchUser = async (search) => {
  try {
    return api.get(`/users?search=${search}`);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const updateUser = async (data) => {
  try {
    return api.patch(`/users/updateMe`, data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
