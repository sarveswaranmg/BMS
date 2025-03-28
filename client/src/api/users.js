import axios, { axiosInstance } from ".";

// Register New User
export const RegisterUser = async (value) => {
  try {
    const response = await axiosInstance.post("api/users/register", value);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const LoginUser = async (value) => {
  try {
    const response = await axiosInstance.post("/api/users/login", value);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const ForgetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "/api/users/forgetpassword",
      value
    );
  } catch (err) {
    console.log(err);
  }
};

export const ResetPassword = async (value, id) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/resetpassword/${id}`,
      value
    );
  } catch (err) {
    console.log(err);
  }
};
