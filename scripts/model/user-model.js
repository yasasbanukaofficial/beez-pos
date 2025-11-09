import { UserDTO as User } from "../dto/user-dto.js";
import { userList as userDB } from "../db/db.js";

const saveUser = (username, email, password) => {
  userDB.push(new User(username, email, password));
};

const deleteUser = (i) => userDB.splice(i, 1);

const getUsers = () => userDB;

const getUserByIndex = (i) => userDB[i];

const getUserByUsername = (username) => {
  return getUsers().find((u) => u.username === username);
};

const getUserCodeByUsername = (u) => {
  return u.code;
};

export {
  saveUser,
  deleteUser,
  getUsers,
  getUserByIndex,
  getUserByUsername,
  getUserCodeByUsername,
};
