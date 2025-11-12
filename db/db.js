import { UserDTO as User } from "../dto/user-dto.js";
import { ItemDTO as Item } from "../dto/item-dto.js";

const userList = [
  new User("Jason Doe", "jason@mail.com", "blah", "1095"),
  new User("Mason Doe", "blue@mail.com", "blah", "1195"),
];

const itemList = [
  new Item("Mechanical Keyboard", "Other", 35, 129.99, "In Stock"),
  new Item("Samsung Galaxy S25 Ultra", "Mobile", 1, 299.0, "In Stock"),
  new Item("Lenovo Legion i7", "Laptop", 12, 299.0, "Low Stock"),
  new Item("Samsung Galaxy S25 Ultra", "Mobile", 1, 299.0, "In Stock"),
];

const categoriesList = [
  {
    icon: "mobile-icon",
    categoryColor: "#cfdddb",
    category: "Mobile",
    cateogoryItemCount: 13,
  },
  {
    icon: "laptop-icon",
    categoryColor: "#f0c8cf",
    category: "Laptop",
    cateogoryItemCount: 24,
  },
  {
    icon: "tablet-icon",
    categoryColor: "#C2DBE9",
    category: "Tablet",
    cateogoryItemCount: 21,
  },
  {
    icon: "other-icon",
    categoryColor: "#C9CAEE",
    category: "Other",
    cateogoryItemCount: 24,
  },
];

export { userList, itemList, categoriesList };
