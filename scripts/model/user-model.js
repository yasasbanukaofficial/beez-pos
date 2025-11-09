import { UserDTO as User } from "../dto/user-dto.js";
import { userList as userDB } from "../db/db.js";

const saveUser = (username, email, password) => {
  userDB.push(new User(username, email, password));
};

const deleteUser = (index) => userDB.splice(index, 1);

const getUsers = () => userDB;

const getUserByIndex = (index) => userDB[index];

export { saveUser, deleteUser, getUsers, getUserByIndex };
