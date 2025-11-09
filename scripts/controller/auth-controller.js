import {
  getUserByUsername,
  getUserCodeByUsername,
} from "../model/user-model.js";

export function handleAuthentication(code, username) {
  let isMatch = false;
  let currentUser = getUserByUsername(username);

  if (getUserCodeByUsername(currentUser) === code) {
    console.log("Successfully Logged IN");
    isMatch = true;
  }

  return isMatch;
}
