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

const getItemBySearchInput = (name) => {
  const items = getItems();

  if (!name) return items;

  const query = name.toString().toLowerCase().trim();

  return items.filter(
    (item) => item.name && item.name.toLowerCase().includes(query)
  );
};

const updateItemStockQty = (orderedItems) => {
  orderedItems.forEach((orderItem) => {
    const itemInStock = itemDB.find(
      (stockItem) => stockItem.name === orderItem.name
    );

    if (itemInStock) {
      const newQty = itemInStock.itemQty - orderItem.qty;
      itemInStock.itemQty = Math.max(0, newQty);
    }
  });
};

const checkStockAvailability = (orderedItems) => {
  for (const orderItem of orderedItems) {
    const itemInStock = itemDB.find(
      (stockItem) => stockItem.name === orderItem.name
    );

    // Check if item exists and if stock quantity is less than ordered quantity
    if (!itemInStock || itemInStock.itemQty < orderItem.qty) {
      // Return the name of the item that caused the failure
      return orderItem.name;
    }
  }
  // All checks passed
  return true;
};

export {
  saveItem,
  updateItem,
  deleteItem,
  getItems,
  getItemByIndex,
  getItemByName,
  getItemBySearchInput,
  updateItemStockQty,
  checkStockAvailability,
};
