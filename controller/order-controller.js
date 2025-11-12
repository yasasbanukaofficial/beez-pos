import {
  deleteOrder,
  getOrderByIndex,
  getOrderBySearchInput,
  getOrders,
  saveOrder,
  updateOrder,
} from "../model/order-model.js";

import {
  getCustomers,
  getCustomerByIndex,
  saveCustomer,
} from "../model/customer-model.js";
import { getItems, getItemByIndex } from "../model/item-model.js";
import { onClick, onkeyDown } from "../utils/event-helper.js";
import { displayToast } from "../utils/toast.js";

let currentEditingIndex = null;
let isEditMode = false;
let selectedPaymentMethod = "Wallet";
let selectedCustomer = null;
let selectedItems = [];

const calculateTotal = (orderedItems) => {
  const cents = orderedItems.reduce((sum, item) => {
    const itemCents = Math.round(Number(item.price) * 100);
    return sum + itemCents * Number(item.qty);
  }, 0);
  return (cents / 100).toFixed(2);
};

const getStatusBadge = (status) => {
  let badgeColor, badgeText, badgeIcon;
  switch ((status || "").toLowerCase()) {
    case "paid":
      badgeColor = "#c9e6c2";
      badgeIcon = "✓";
      badgeText = "Paid";
      break;
    case "in process":
      badgeColor = "#f6e7b1";
      badgeIcon = "⧗";
      badgeText = "In Process";
      break;
    case "cancelled":
      badgeColor = "#e0bfcf";
      badgeIcon = "✕";
      badgeText = "Cancelled";
      break;
    default:
      badgeColor = "#f0c8cf";
      badgeIcon = "✗";
      badgeText = "Not Paid";
      break;
  }
  return `<span class="px-3 py-1 rounded-3 small fw-semibold" style="background-color: ${badgeColor}; color: #111">${badgeIcon} ${badgeText}</span>`;
};

const getOrderItemsTableRows = (orderedItems) => {
  return orderedItems
    .map(
      (item) => `
    <tr>
      <td>${String(item.qty).padStart(2, "0")}</td>
      <td>${item.name}</td>
      <td class="text-end">$${Number(item.price).toFixed(2)}</td>
    </tr>`
    )
    .join("");
};

const getOrderCard = (order, index) => {
  const total = calculateTotal(order.orderedItems);
  const badge = getStatusBadge(order.orderStatus);
  const rows = getOrderItemsTableRows(order.orderedItems);
  const dateTime = `${order.orderDate} • ${order.orderTime}`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card bg-dark border-0 text-white rounded-3 shadow-sm p-3 order-card" 
        style="background-color: #1b1d1e"
        data-order-index="${index}"
        data-bs-toggle="modal"
        data-bs-target="#orderDetailsModal">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold fs-5">${(index + 1)
            .toString()
            .padStart(2, "0")}</span>
          ${badge}
        </div>
        <p class="fw-semibold mb-0">${order.customerName}</p>
        <p class="text-muted small mb-3">${order.customerEmail}</p>
        <p class="small mb-1 text-muted">${dateTime}</p>
        <table class="table table-dark table-borderless mb-0">
          <thead class="small text-muted">
            <tr><th>Qty</th><th>Items</th><th class="text-end">Price</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <hr class="text-secondary" />
        <div class="d-flex justify-content-between align-items-center">
          <p class="fw-semibold mb-0">Full Total</p>
          <p class="fw-semibold mb-0">$${total}</p>
        </div>
        <div class="d-flex flex-row justify-content-between align-items-center mt-3">
          <button class="btn border-0 text-white p-2 edit-order-btn"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn border-0 text-white p-2 delete-order-btn" data-order-index="${index}"><i class="fa-solid fa-trash"></i></button>
          <button class="btn flex-grow-1 text-dark fw-semibold py-2 border-0" style="background-color: #c9caee"
            data-bs-toggle="modal" data-bs-target="#orderDetailsModal">Pay Bill</button>
        </div>
      </div>
    </div>`;
};

const displayOrderCard = (filterStatus = null) => {
  $("#orderCardWrapper").empty();
  const orders = getOrders();
  const filtered = filterStatus
    ? orders.filter(
        (o) =>
          (o.orderStatus || "").toLowerCase() === filterStatus.toLowerCase()
      )
    : orders;
  filtered.forEach((order, index) =>
    $("#orderCardWrapper").append(getOrderCard(order, index))
  );
};

const loadCustomerSelect = () => {
  const customers = getCustomers();
  const select = $("#customerSelect");
  select.empty();
  select.append('<option value="">-- Select Customer --</option>');
  customers.forEach((c, i) =>
    select.append(`<option value="${i}">${c.name} - ${c.email || ""}</option>`)
  );
};

const loadItemSelect = () => {
  const items = getItems();
  const select = $("#itemSelect");
  select.empty();
  items.forEach((item, i) =>
    select.append(
      `<option value="${i}">${item.name} - $${Number(item.price).toFixed(
        2
      )}</option>`
    )
  );
};

const loadOrderDetailsModal = (order, index = null) => {
  selectedCustomer =
    getCustomers().find((c) => c.name === order.customerName) || null;
  selectedItems = (order.orderedItems || []).map((i) => ({ ...i }));
  selectedPaymentMethod = order.paymentMethod || "Wallet";
  currentEditingIndex = index;

  $("#orderDetailsModalLabel").text(
    order.orderId
      ? `Order ${order.orderId}`
      : index !== null
      ? `Order ${(index + 1).toString().padStart(2, "0")}`
      : "Order"
  );
  $("#modalCustomerName").text(
    selectedCustomer ? selectedCustomer.name : "Select Customer"
  );

  const itemsHTML = selectedItems
    .map(
      (item, idx) => `
      <div class="d-flex justify-content-between align-items-center rounded-3 p-3 position-relative" style="background-color: #2a2c2d">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-3 d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px; background-color: #dbeaf5; color: #081018; font-weight: 700;">
            ${(idx + 1).toString().padStart(2, "0")}
          </div>
          <div>
            <div class="fw-semibold">${item.name}</div>
            <div class="small text-muted">x ${item.qty}</div>
          </div>
        </div>
        <div class="fw-semibold me-4">$${Number(item.price).toFixed(2)}</div>
        <button class="btn btn-sm border-0 text-danger position-absolute end-0 me-2 ${
          isEditMode ? "" : "d-none"
        } delete-item-btn"><i class="fa-solid fa-trash"></i></button>
      </div>`
    )
    .join("");

  $("#modalItemsList").html(itemsHTML);

  const subtotal = calculateTotal(selectedItems);
  $("#modalSubtotal div:last-child").text(`$${subtotal}`);
  $("#modalTotal div:last-child").text(`$${subtotal}`);
  $("#modalReceived div:last-child").text(`$${subtotal}`);

  $(".payment-btn").each(function () {
    const method = $(this).data("method");
    if (method === selectedPaymentMethod) {
      $(this)
        .removeClass("bg-transparent border text-white")
        .addClass("btn-light text-dark")
        .attr("style", "");
    } else {
      $(this)
        .removeClass("btn-light text-dark")
        .addClass("bg-transparent border text-white")
        .attr("style", "border-color: #3a3c3d");
    }
  });

  $("#orderStatusSelect").val(order.orderStatus || "not paid");

  if (isEditMode) {
    $("#editOrderBtn").addClass("btn-warning");
  } else {
    $("#editOrderBtn").removeClass("btn-warning");
  }
};

onClick(".order-card", function () {
  const index = $(this).data("order-index");
  const order = getOrderByIndex(index);
  currentEditingIndex = index;
  isEditMode = false;
  loadCustomerSelect();
  loadItemSelect();
  loadOrderDetailsModal(order, index);
});

onClick(".edit-order-btn", function (e) {
  e.stopPropagation();
  const wrapper = $(this).closest(".order-card");
  const idx = wrapper.data("order-index");
  const order = getOrderByIndex(idx);
  isEditMode = true;
  currentEditingIndex = idx;
  loadCustomerSelect();
  loadItemSelect();
  loadOrderDetailsModal(order, idx);
  $("#orderDetailsModal").modal("show");
});

onClick("#editOrderBtn", function () {
  isEditMode = !isEditMode;
  $("#modalItemsList .delete-item-btn").toggleClass("d-none", !isEditMode);
  $("#customerSelect").prop("disabled", !isEditMode);
  $("#itemSelect").prop("disabled", !isEditMode);
  $("#orderStatusSelect").prop("disabled", !isEditMode);
});

onClick(".delete-item-btn", function (e) {
  e.stopPropagation();
  const idx = $(this).closest(".rounded-3").index();
  selectedItems.splice(idx, 1);
  $(this).closest(".rounded-3").remove();
  const total = calculateTotal(selectedItems);
  $("#modalSubtotal div:last-child").text(`$${total}`);
  $("#modalTotal div:last-child").text(`$${total}`);
  $("#modalReceived div:last-child").text(`$${total}`);
});

onClick(".delete-order-btn", function (e) {
  e.stopPropagation();
  const index = $(this).data("order-index");
  if (confirm("Are you sure you want to delete this order?")) {
    if (deleteOrder(index)) {
      displayToast("success", "Order deleted successfully!");
      displayOrderCard();
    } else {
      displayToast("error", "Failed to delete order!");
    }
  }
});

onkeyDown("#searchOrderInput", (e) => {
  const value = $("#searchOrderInput").val();
  if (!value) {
    displayOrderCard();
  } else {
    const results = getOrderBySearchInput(value);
    $("#orderCardWrapper").empty();
    results.forEach((order, index) =>
      $("#orderCardWrapper").append(getOrderCard(order, index))
    );
  }
});

onClick("#addOrderBtn", function () {
  currentEditingIndex = null;
  isEditMode = true;
  selectedCustomer = null;
  selectedItems = [];
  selectedPaymentMethod = "Wallet";

  $("#orderDetailsModalLabel").text("New Order");
  $("#modalCustomerName").text("Select Customer");
  $("#modalItemsList").html("");
  $("#modalSubtotal div:last-child").text("$0.00");
  $("#modalTotal div:last-child").text("$0.00");
  $("#modalReceived div:last-child").text("$0.00");

  $(".payment-btn")
    .removeClass("btn-light text-dark")
    .addClass("bg-transparent border text-white")
    .attr("style", "border-color: #3a3c3d");
  $(`.payment-btn[data-method="Wallet"]`)
    .removeClass("bg-transparent border text-white")
    .addClass("btn-light text-dark")
    .attr("style", "");

  loadCustomerSelect();
  loadItemSelect();
  $("#customerSelect").prop("disabled", false);
  $("#itemSelect").prop("disabled", false);
  $("#orderStatusSelect").prop("disabled", false);
  $("#orderDetailsModal").modal("show");
});

$("#customerSelect").on("change", function () {
  const index = $(this).val();
  if (index === "") {
    selectedCustomer = null;
    $("#modalCustomerName").text("Select Customer");
  } else {
    selectedCustomer = getCustomerByIndex(index);
    $("#modalCustomerName").text(selectedCustomer.name);
  }
});

$("#itemSelect").on("change", function () {
  const selectedIndices = $(this).val() || [];
  selectedItems = selectedIndices.map((i) => {
    const item = getItemByIndex(i);
    return { ...item, qty: 1 };
  });

  const listHTML = selectedItems
    .map(
      (item, idx) => `
      <div class="d-flex justify-content-between align-items-center rounded-3 p-3" style="background-color:#2a2c2d">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-3 d-flex align-items-center justify-content-center"
            style="width:40px;height:40px;background-color:#dbeaf5;color:#081018;font-weight:700;">
            ${(idx + 1).toString().padStart(2, "0")}
          </div>
          <div>
            <div class="fw-semibold">${item.name}</div>
            <div class="small text-muted">x ${item.qty}</div>
          </div>
        </div>
        <div class="fw-semibold me-4">$${Number(item.price).toFixed(2)}</div>
      </div>`
    )
    .join("");

  $("#modalItemsList").html(listHTML);

  const total = calculateTotal(selectedItems);
  $("#modalSubtotal div:last-child").text(`$${total}`);
  $("#modalTotal div:last-child").text(`$${total}`);
  $("#modalReceived div:last-child").text(`$${total}`);
});

onClick(".payment-btn", function () {
  $(".payment-btn").each(function () {
    $(this)
      .removeClass("btn-light text-dark")
      .addClass("bg-transparent border text-white")
      .attr("style", "border-color: #3a3c3d");
  });
  $(this)
    .removeClass("bg-transparent border text-white")
    .addClass("btn-light text-dark")
    .attr("style", "");
  selectedPaymentMethod = $(this).data("method");
});

onClick("#saveOrderBtn", function () {
  if (!selectedCustomer)
    return displayToast("error", "Please select a customer!");
  if (selectedItems.length === 0)
    return displayToast("error", "Please select at least one item!");

  const orderData = {
    customerName: selectedCustomer.name,
    customerEmail: selectedCustomer.email,
    orderDate: new Date().toLocaleDateString(),
    orderTime: new Date().toLocaleTimeString(),
    orderStatus: $("#orderStatusSelect").val() || "not paid",
    orderedItems: selectedItems,
    paymentMethod: selectedPaymentMethod || "Wallet",
  };

  if (
    isEditMode &&
    currentEditingIndex !== null &&
    currentEditingIndex !== undefined
  ) {
    const updatedOrder = {
      index: currentEditingIndex,
      ...orderData,
    };
    if (updateOrder(updatedOrder)) {
      displayToast("success", "Order updated!");
      displayOrderCard();
      $("#orderDetailsModal").modal("hide");
    } else {
      displayToast("error", "Failed to update order!");
    }
  } else {
    if (saveOrder(orderData)) {
      displayToast("success", "New order added!");
      displayOrderCard();
      $("#orderDetailsModal").modal("hide");
    } else {
      displayToast("error", "Failed to save order!");
    }
  }
});

onClick("#saveCustomerBtn", function () {
  const name = $("#newCustomerName").val().trim();
  const email = $("#newCustomerEmail").val().trim();
  if (!name) return displayToast("error", "Customer name required");
  const c = { name, email };
  if (saveCustomer && typeof saveCustomer === "function") {
    saveCustomer(c);
    displayToast("success", "Customer added");
    $("#addCustomerModal").modal("hide");
    $("#newCustomerName").val("");
    $("#newCustomerEmail").val("");
    loadCustomerSelect();
  } else {
    displayToast("error", "Unable to add customer");
  }
});

onClick("#filterAll", function () {
  $("#filterAll")
    .removeClass("btn-outline-secondary text-white")
    .addClass("btn-light text-dark");
  $("#filterInProcess,#filterCompleted,#filterCancelled")
    .removeClass("btn-light text-dark")
    .addClass("btn-outline-secondary text-white");
  displayOrderCard();
});
onClick("#filterInProcess", function () {
  $("#filterInProcess")
    .removeClass("btn-outline-secondary text-white")
    .addClass("btn-light text-dark");
  $("#filterAll,#filterCompleted,#filterCancelled")
    .removeClass("btn-light text-dark")
    .addClass("btn-outline-secondary text-white");
  displayOrderCard("in process");
});
onClick("#filterCompleted", function () {
  $("#filterCompleted")
    .removeClass("btn-outline-secondary text-white")
    .addClass("btn-light text-dark");
  $("#filterAll,#filterInProcess,#filterCancelled")
    .removeClass("btn-light text-dark")
    .addClass("btn-outline-secondary text-white");
  displayOrderCard("paid");
});
onClick("#filterCancelled", function () {
  $("#filterCancelled")
    .removeClass("btn-outline-secondary text-white")
    .addClass("btn-light text-dark");
  $("#filterAll,#filterInProcess,#filterCompleted")
    .removeClass("btn-light text-dark")
    .addClass("btn-outline-secondary text-white");
  displayOrderCard("cancelled");
});

export { displayOrderCard };
