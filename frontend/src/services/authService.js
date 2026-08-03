import api from "./api.js";

export const createUser = async (data) => {
  try {
    return api.post("/users/signup", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const login = async (data) => {
  try {
    return api.post("/users/login", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    return api.patch("/users/updatePassword", data);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const logout = async () => {
  try {
    return api.post("/users/logout", {});
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};

export const getMe = async () => {
  try {
    return api.get("/users/getMe");
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
