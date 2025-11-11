import { UserDTO as User } from "../dto/user-dto.js";
import { ItemDTO as Item } from "../dto/item-dto.js";

const userList = [
  new User("Jason Doe", "jason@mail.com", "blah", "1095"),
  new User("Mason Doe", "blue@mail.com", "blah", "1195"),
];

const itemList = [
  new Item("Mechanical Keyboard", "Electronics", 35, 129.99, "In Stock"),
  new Item("Ergonomic Mouse", "Electronics", 150, 45.0, "In Stock"),
  new Item("LED Monitor 27in", "Peripherals", 12, 299.0, "Low Stock"),
];

export { userList, itemList };
