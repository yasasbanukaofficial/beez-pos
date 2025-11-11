import { ItemDTO as Item } from "../dto.ts";
import { itemList as itemDB } from "../item-list.ts";

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
