import { UserDTO as User } from "../dto/user-dto.js";
import { ItemDTO as Item } from "../dto/item-dto.js";
import { CustomerDTO as Customer } from "../dto/customer-dto.js";

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

const customerList = [
  new Customer("John Doe", "john.doe@email.com", 45, "077-123-4567"),
  new Customer("Jane Smith", "jane.smith@work.net", 22, "071-987-6543"),
  new Customer("Michael Johnson", "michael.j@corp.com", 33, "075-555-1111"),
  new Customer("Emily Davis", "emily.d@test.org", 51, "070-444-2222"),
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

export { userList, itemList, categoriesList, customerList };
