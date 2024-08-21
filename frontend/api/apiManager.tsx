import axios from "axios";
import { Platform } from "react-native";
import { URL_IOS, URL_ANDROID } from "@env";

const baseURL = Platform.OS === "ios" ? URL_IOS : URL_ANDROID;

const apiManager = axios.create({
  baseURL: baseURL,
  responseType: "json",
});

export default apiManager;
