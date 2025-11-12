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

export {
  saveItem,
  updateItem,
  deleteItem,
  getItems,
  getItemByIndex,
  getItemByName,
  getItemBySearchInput,
  updateItemStockQty,
};
