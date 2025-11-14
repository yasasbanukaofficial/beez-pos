import { UserDTO as User } from "../dto/user-dto.js";
import { ItemDTO as Item } from "../dto/item-dto.js";
import { CustomerDTO as Customer } from "../dto/customer-dto.js";
import { OrderDTO as Order } from "../dto/order-dto.js";

const userList = [
  new User("Itadori Yuji", "yuiji@mail.com", "blah", "1095"),
  new User("Gojo Satoru", "blueeyes@mail.com", "blah", "1195"),
];

const itemList = [
  new Item("Mechanical Keyboard", "Other", 35, 129.99, "In Stock"),
  new Item("Samsung Galaxy S25 Ultra", "Mobile", 1, 299.0, "In Stock"),
  new Item("Lenovo Legion i7", "Laptop", 12, 299.0, "Low Stock"),
  new Item("Samsung Galaxy S25 Ultra", "Mobile", 1, 299.0, "In Stock"),
];

const customerList = [
  new Customer("Yuji Itadori", "yuji@email.com", 20, "077-123-4567"),
  new Customer("Yasas Banuka", "yasasbanu@banu.com", 18, "071-987-6543"),
  new Customer("Satoru Gojo", "blue.eyes@jjk.com", 21, "075-555-1111"),
  new Customer("Makima San", "maki@jjk.com", 21, "070-444-2222"),
];

const orderList = [
  new Order(
    "Itadori Yuji",
    "yuji@tech.com",
    "Nov 14, 2025",
    "4:48 PM",
    "Paid",
    [
      { name: "Macbook Air", qty: 1, price: 600.0 },
      { name: "iPhone 17 Max", qty: 1, price: 120.0 },
    ]
  ),
  new Order(
    "Gojo Satoru",
    "blue.eyes@work.net",
    "Nov 14, 2025",
    "10:15 AM",
    "In Process",
    [
      { name: "Mechanical Keyboard", qty: 2, price: 129.99 },
      { name: "Wireless Mouse", qty: 1, price: 45.0 },
    ]
  ),
  new Order(
    "Yasas Banuka",
    "yasas@banu.com",
    "Nov 14, 2025",
    "2:30 PM",
    "Not Paid",
    [{ name: "Lenovo Legion i7", qty: 1, price: 299.0 }]
  ),
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

export { userList, itemList, categoriesList, customerList, orderList };
