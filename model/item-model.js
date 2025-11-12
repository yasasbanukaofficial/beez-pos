import { ItemDTO as Item } from "../dto/item-dto.js";
import { itemList as itemDB } from "../db/db.js";

const saveItem = (updatedItem) => {
  itemDB.push(
    new Item(
      updatedItem.name,
      updatedItem.category,
      updatedItem.qty,
      updatedItem.price,
      updatedItem.availability
    )
  );
  return true;
};

const updateItem = (updatedItem) => {
  if (updatedItem.index < 0 || updatedItem.index >= itemDB.length) return false;

  itemDB[updatedItem.index] = {
    name: updatedItem.name,
    itemPrice: updatedItem.price,
    itemQty: updatedItem.qty,
    availability: updatedItem.availability,
    category: updatedItem.category,
  };

  return true;
};

const deleteItem = (i) => itemDB.splice(i, 1);

const getItems = () => itemDB;

const getItemByIndex = (i) => itemDB[i];

const getItemByName = (name) => {
  return getItems().find((item) => item.name === name);
};

export {
  saveItem,
  updateItem,
  deleteItem,
  getItems,
  getItemByIndex,
  getItemByName,
};
