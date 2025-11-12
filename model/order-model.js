import { OrderDTO as Order } from "../dto/order-dto.js";
import { orderList as orderDB } from "../db/db.js";

const saveOrder = (updatedOrder) => {
  orderDB.push(
    new Order(
      updatedOrder.customerName,
      updatedOrder.customerEmail,
      updatedOrder.orderDate,
      updatedOrder.orderTime,
      updatedOrder.orderStatus,
      updatedOrder.orderedItems,
      updatedOrder.paymentMethod
    )
  );
  return true;
};

const updateOrder = (updatedOrder) => {
  if (updatedOrder.index < 0 || updatedOrder.index >= orderDB.length)
    return false;

  const oldOrder = orderDB[updatedOrder.index];

  orderDB[updatedOrder.index] = new Order(
    updatedOrder.customerName || oldOrder.customerName,
    updatedOrder.customerEmail || oldOrder.customerEmail,
    updatedOrder.orderDate || oldOrder.orderDate,
    updatedOrder.orderTime || oldOrder.orderTime,
    updatedOrder.orderStatus || oldOrder.orderStatus,
    updatedOrder.orderedItems || oldOrder.orderedItems,
    updatedOrder.paymentMethod || oldOrder.paymentMethod
  );

  return true;
};

const deleteOrder = (i) => orderDB.splice(i, 1);

const getOrders = () => orderDB;

const getOrderByIndex = (i) => orderDB[i];

const getOrderBySearchInput = (input) => {
  const orders = getOrders();

  if (!input) return orders;

  const query = input.toString().toLowerCase().trim();

  return orders.filter(
    (order) =>
      (order.customerName &&
        order.customerName.toLowerCase().includes(query)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(query))
  );
};

export {
  saveOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  getOrderByIndex,
  getOrderBySearchInput,
};
