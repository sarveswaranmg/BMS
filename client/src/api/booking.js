import { axiosInstance } from "./index";

export const makePayment = async (token, amount) => {
  try {
    console.log("api called");
    const response = await axiosInstance.post("/api/bookings/make-payment", {
      token,
      amount,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const bookShow = async (payload) => {
  try {
    console.log("fetching");
    const response = await axiosInstance.post(
      "/api/bookings/book-show",
      payload
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllBookings = async (payload) => {
  try {
    const response = await axiosInstance.get(
      `/api/bookings/get-all-bookings/${payload.userId}`
    );
    console.log(response);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
