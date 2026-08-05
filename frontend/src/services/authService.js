import api from "./api.js";

export const createUser = async (data) => {
  try {
    return await api.post("/users/signup", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await api.post("/users/login", data);
    return response;
  } catch (error) {
    console.log(error.response);
    if (error.response) throw error.response;
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    return await api.patch("/users/updatePassword", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const logout = async () => {
  try {
    return await api.post("/users/logout", {});
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const getMe = async () => {
  try {
    return await api.get("/users/getMe");
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
