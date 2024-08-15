import axios from "axios";
import { PUBLISH_MESSAGE_URL, SUBSCRIBE_USER_URL } from "../util/ApiConstants";

export const subscribeUser = async (email) => {
  try {
    await axios.get(SUBSCRIBE_USER_URL + email);
  } catch (error) {}
}

export const publishMessage = async (email, message) => {
  try {
    await axios.get(PUBLISH_MESSAGE_URL + email + ":::" + message);
  } catch (error) {}
}