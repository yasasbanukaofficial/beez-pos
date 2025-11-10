import {
  getUserByUsername,
  getUserCodeByUsername,
} from "../model/user-model.js";
import { sessionController } from "./session-controller.js";

export function handleAuthentication(code, username) {
  let isMatch = false;
  let currentUser = getUserByUsername(username);

  if (getUserCodeByUsername(currentUser) === code) {
    console.log("Successfully Logged IN");
    sessionController.saveSessionItem("loggedInUser", "true");
    isMatch = true;
  }

  return isMatch;
}
