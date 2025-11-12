import {
  deleteOrder,
  getOrderByIndex,
  getOrderBySearchInput,
  getOrders,
  saveOrder,
  updateOrder,
} from "../model/order-model.js";
import { getCustomers, saveCustomer } from "../model/customer-model.js";
import { getItems } from "../model/item-model.js";
import { onClick, onkeyDown } from "../utils/event-helper.js";
import { displayToast } from "../utils/toast.js";
import { OrderDTO } from "../dto/order-dto.js";

let currentEditingIndex = null;
let isEditMode = false;
let currentOrderItems = [];

const calculateTotal = (orderedItems) => {
  if (!orderedItems || orderedItems.length === 0) return "0.00";
  // NOTE: Order items use 'price', so this is fine.
  return orderedItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);
};

const getStatusBadge = (status) => {
  let badgeColor, badgeText, badgeIcon;
  switch (status?.toLowerCase()) {
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
    default:
      badgeColor = "#f0c8cf";
      badgeIcon = "✗";
      badgeText = "Not Paid";
      break;
  }
  return `<span class="px-3 py-1 rounded-3 small fw-semibold" style="background-color: ${badgeColor}; color: #111">${badgeIcon} ${badgeText}</span>`;
};

const getOrderItemsTableRows = (orderedItems) => {
  if (!orderedItems || orderedItems.length === 0) {
    return '<tr><td colspan="3" class="text-center text-muted small">No items</td></tr>';
  }
  return orderedItems
    .map(
      (item) => `
    <tr>
      <td>${item.qty < 10 ? "0" : ""}${item.qty}</td>
      <td>${item.name}</td>
      <td class="text-end">$${(item.price * item.qty).toFixed(2)}</td>
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
          <button class="btn border-0 text-white p-2 edit-order-btn" style="pointer-events: none; opacity: 0;"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn border-0 text-white p-2 delete-order-btn" data-order-index="${index}"><i class="fa-solid fa-trash"></i></button>
          <button class="btn flex-grow-1 text-dark fw-semibold py-2 border-0" style="background-color: #c9caee"
            data-bs-toggle="modal" data-bs-target="#orderDetailsModal">View Order</button>
        </div>
      </div>
    </div>`;
};

const displayOrderCard = () => {
  $("#orderCardWrapper").empty();
  const orders = getOrders();
  orders.forEach((order, index) =>
    $("#orderCardWrapper").append(getOrderCard(order, index))
  );
};

const updateItemDropdown = () => {
  const itemMenu = $("#itemDropdownMenu");
  itemMenu.empty();
  const items = getItems();
  items.forEach((item) => {
    // FIX 1: Use item.itemPrice (from DTO getter) for display and data attribute
    const priceValue = item.itemPrice;
    const formattedPrice = priceValue ? priceValue.toFixed(2) : "0.00";

    const isAdded = currentOrderItems.some(
      (orderItem) => orderItem.name === item.name
    );
    const itemRow = `
      <div class="d-flex justify-content-between align-items-center px-2 py-2 dropdown-item bg-dark text-white rounded-3 item-select-row"
        data-item-name="${item.name}" data-item-price="${
      priceValue // Use priceValue here for the data attribute
    }" data-item-stock="${item.itemQty}"> 
        <div class="d-flex flex-column">
          <div class="fw-semibold">${item.name}</div>
          <div class="small text-muted">$${formattedPrice}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="small text-muted">Stock: ${item.itemQty}</div>
          <button class="btn btn-sm ${
            isAdded ? "btn-outline-secondary" : "btn-success"
          } add-item-btn" ${isAdded ? "disabled" : ""}>
            ${isAdded ? "Added" : '<i class="fa-solid fa-plus"></i>'}
          </button>
        </div>
      </div>`;
    itemMenu.append(itemRow);
  });
};

const renderItemsList = () => {
  const itemsHTML = currentOrderItems
    .map(
      (item, idx) => `
      <div class="d-flex justify-content-between align-items-center rounded-3 p-3 item-row" style="background-color: #2a2c2d" data-item-name="${
        item.name
      }">
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
        <div class="d-flex align-items-center gap-2">
          <div class="fw-semibold">$${(item.qty * item.price).toFixed(2)}</div>
          <button class="btn btn-sm border-0 text-danger delete-item-btn" data-item-name="${
            item.name
          }" style="${isEditMode ? "" : "display:none;"}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>`
    )
    .join("");

  $("#modalItemsList").html(
    itemsHTML ||
      '<p class="text-center text-muted small mt-2">No items added to the order.</p>'
  );

  const subtotal = calculateTotal(currentOrderItems);
  $("#modalSubtotal").text(`$${subtotal}`);
  $("#modalTotal").text(`$${subtotal}`);
  $("#modalReceived").text(`$${subtotal}`);

  updateItemDropdown();
};

const setPaymentMethod = (methodName) => {
  $("#paymentMethodWrapper .payment-btn").each(function () {
    const btnMethod = $(this).data("method");
    const isActive = btnMethod === methodName;
    $(this).toggleClass("active", isActive);
    if (isActive) {
      $(this)
        .css("background-color", "#c9caee")
        .css("color", "#111")
        .css("border-color", "#c9caee");
    } else {
      $(this)
        .css("background-color", "transparent")
        .css("color", "white")
        .css("border-color", "#3a3c3d");
    }
  });
};

const loadOrderDetailsModal = (order) => {
  currentOrderItems = order ? [...order.orderedItems] : [];
  currentEditingIndex = order ? getOrders().indexOf(order) : null;
  const customers = getCustomers();

  // Populate Customer Select
  $("#customerSelect").html(
    customers
      .map(
        // Use index as a fallback value if customer DTO doesn't have an 'id'
        (c, idx) =>
          `<option value="${c.id || idx}" data-email="${c.email}">${
            c.name
          }</option>`
      )
      .join("")
  );

  // Populate Order Status Select
  $("#orderStatusSelect").html(
    [
      '<option value="In Process">In Process</option>',
      '<option value="Paid">Paid</option>',
      '<option value="Not Paid">Not Paid</option>',
    ].join("")
  );

  // Update Modal Header and State
  if (order) {
    // EXISTING ORDER: Start in View Mode (isEditMode = false)
    isEditMode = false;

    const selectedCustomer =
      customers.find((c) => c.name === order.customerName) || customers[0];

    $("#orderDetailsModalLabel").text(
      `Order ${(currentEditingIndex + 1).toString().padStart(2, "0")}`
    );
    $("#modalCustomerName").html(
      `<span id="modalCustomerNameText">${
        order.customerName
      }</span><div class="small text-muted">${order.customerEmail || ""}</div>`
    );
    // Use the ID or index for setting the value
    $("#customerSelect")
      .val(
        selectedCustomer
          ? selectedCustomer.id || customers.indexOf(selectedCustomer)
          : customers[0]?.id || 0
      )
      .prop("disabled", true);
    $("#orderStatusSelect").val(order.orderStatus).prop("disabled", true);
    setPaymentMethod(order.paymentMethod || "Wallet");
    $("#saveOrderBtn").text("Update Order").prop("disabled", true);
    $("#editOrderBtn")
      .removeClass("d-none")
      .find("i")
      .removeClass("fa-check")
      .addClass("fa-pen");
  } else {
    // NEW ORDER: Start in Edit Mode (isEditMode = true)
    isEditMode = true;

    $("#orderDetailsModalLabel").text("New Order");

    // Select the first customer automatically
    const firstCustomer = customers[0];
    const firstCustomerValue = firstCustomer ? firstCustomer.id || 0 : "";
    const firstCustomerName = firstCustomer
      ? firstCustomer.name
      : "Select Customer to begin";
    const firstCustomerEmail = firstCustomer ? firstCustomer.email : "";

    $("#customerSelect").prop("disabled", false).val(firstCustomerValue);

    $("#modalCustomerName").html(`
        <span id="modalCustomerNameText">${firstCustomerName}</span>
        <div class="small text-muted">${firstCustomerEmail}</div>
    `);

    $("#orderStatusSelect").val("In Process").prop("disabled", false);
    setPaymentMethod("Wallet");
    $("#saveOrderBtn").text("Save New Order").prop("disabled", false);
    $("#editOrderBtn").addClass("d-none");
  }

  // Set the disabled property based on the current isEditMode state
  $(
    "#customerSelect, #orderStatusSelect, #itemDropdownButton, #addCustomerBtn"
  ).prop("disabled", !isEditMode);
  $("#paymentMethodWrapper .payment-btn").prop("disabled", !isEditMode);
  $("#itemDropdownButton").text(isEditMode ? "Select Items" : "View Items");

  renderItemsList();
};

const handleSaveOrder = () => {
  const customerId = $("#customerSelect").val();
  // Find customer by ID (or index if ID is not available)
  const selectedCustomer = getCustomers().find(
    (c, index) => c.id == customerId || index == customerId
  );
  const status = $("#orderStatusSelect").val();
  const paymentMethod = $("#paymentMethodWrapper .payment-btn.active").data(
    "method"
  );

  // Validation
  if (!selectedCustomer) {
    displayToast("error", "Please select a customer.");
    return;
  }
  if (currentOrderItems.length === 0) {
    displayToast("error", "Order must contain at least one item.");
    return;
  }

  const now = new Date();
  const orderData = {
    customerName: selectedCustomer.name,
    customerEmail: selectedCustomer.email,
    orderDate: now.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    orderTime: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    orderStatus: status,
    orderedItems: currentOrderItems,
    paymentMethod: paymentMethod,
  };

  let success = false;
  let message = "";

  if (currentEditingIndex !== null) {
    orderData.index = currentEditingIndex;
    success = updateOrder(orderData);
    message = "Order updated successfully!";
  } else {
    success = saveOrder(orderData);
    message = "New order saved successfully!";
  }

  if (success) {
    displayToast("success", message);
    displayOrderCard();
    $("#orderDetailsModal").modal("hide");
  } else {
    displayToast("error", "Failed to save order.");
  }
};

// --- Event Listeners ---

onClick(".order-card", function () {
  const index = $(this).data("order-index");
  const order = getOrderByIndex(index);
  loadOrderDetailsModal(order);
});

onClick("#addOrderBtn", function () {
  loadOrderDetailsModal(null);
});

onClick("#editOrderBtn", function () {
  isEditMode = !isEditMode;
  $(this).find("i").toggleClass("fa-pen fa-check");
  $(
    "#customerSelect, #orderStatusSelect, #itemDropdownButton, #addCustomerBtn"
  ).prop("disabled", !isEditMode);
  $("#paymentMethodWrapper .payment-btn").prop("disabled", !isEditMode);
  $("#saveOrderBtn")
    .prop("disabled", !isEditMode)
    .text(isEditMode ? "Update Order" : "Order Completed");

  $("#modalItemsList .delete-item-btn").css(
    "display",
    isEditMode ? "" : "none"
  );
  $("#itemDropdownButton").text(isEditMode ? "Select Items" : "View Items");

  if (isEditMode) {
    $("#modalCustomerName").html(`
      <span id="modalCustomerNameText">${
        getOrderByIndex(currentEditingIndex).customerName
      }</span>
      <div class="small text-muted">${
        getOrderByIndex(currentEditingIndex).customerEmail
      }</div>
    `);
  } else {
    // If exiting edit mode, revert items list display to non-editable
    renderItemsList();
  }
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

onClick("#itemDropdownMenu .add-item-btn", function (e) {
  e.stopPropagation();

  const row = $(this).closest(".item-select-row");
  const name = row.data("item-name");

  // FIX 1: Retrieve data attribute string, which was set using item.itemPrice, and ensure it's a number
  const priceString = row.data("item-price");
  const price = parseFloat(priceString) || 0; // The 0 fallback is for safety, but priceString should now be correct

  const stock = parseInt(row.data("item-stock"));

  if (stock <= 0) {
    displayToast("error", `Item ${name} is out of stock.`);
    return;
  }

  // Check if item already exists in current order
  let existingItem = currentOrderItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    // Note: The price stored in currentOrderItems is named 'price' (lowercase)
    currentOrderItems.push({ name, qty: 1, price });
  }

  renderItemsList();
  displayToast("success", `${name} added to order!`);
});

onClick(".delete-item-btn", function (e) {
  e.preventDefault();
  const itemName = $(this).data("item-name");
  currentOrderItems = currentOrderItems.filter(
    (item) => item.name !== itemName
  );
  renderItemsList();
  displayToast("success", "Item removed successfully!");
});

onClick("#paymentMethodWrapper .payment-btn", function (e) {
  e.preventDefault();
  const method = $(this).data("method");
  setPaymentMethod(method);
});

onClick("#saveOrderBtn", handleSaveOrder);

onClick("#saveCustomerBtn", function () {
  const name = $("#newCustomerName").val().trim();
  const email = $("#newCustomerEmail").val().trim();

  if (!name) {
    displayToast("error", "Customer name cannot be empty.");
    return;
  }

  if (saveCustomer({ name, email })) {
    displayToast("success", "Customer saved! Please select from the dropdown.");
    $("#addCustomerModal").modal("hide");

    // Refresh the order modal state to update the customer dropdown
    const customers = getCustomers();
    $("#customerSelect").html(
      customers
        .map(
          (c, idx) =>
            `<option value="${c.id || idx}" data-email="${c.email}">${
              c.name
            }</option>`
        )
        .join("")
    );
    // Select the newly added customer
    const lastCustomer = customers[customers.length - 1];
    $("#customerSelect").val(lastCustomer.id || customers.length - 1);

    // Ensure the main order modal is still open
    $("#orderDetailsModal").modal("show");
  } else {
    displayToast("error", "Failed to save customer.");
  }
});

onkeyDown("#searchOrderInput", (e) => {
  const value = $("#searchOrderInput").val();
  if (e.key === "Backspace" || !value) {
    displayOrderCard();
  } else {
    const results = getOrderBySearchInput(value);
    $("#orderCardWrapper").empty();
    results.forEach((order, index) =>
      $("#orderCardWrapper").append(getOrderCard(order, index))
    );
  }
});

export { displayOrderCard };
