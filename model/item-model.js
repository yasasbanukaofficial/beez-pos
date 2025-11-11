import { ItemDTO as Item } from "../dto/item-dto.js";
import { itemList as itemDB } from "../db/db.js";

const saveItem = (name, category, itemQty, itemPrice, productStatus) => {
  itemDB.push(new Item(name, category, itemQty, itemPrice, productStatus));
};

const deleteItem = (i) => itemDB.splice(i, 1);

const getItems = () => itemDB;

const getItemByIndex = (i) => itemDB[i];

const getItemByName = (name) => {
  return getItems().find((item) => item.name === name);
};

export { saveItem, deleteItem, getItems, getItemByIndex, getItemByName };
