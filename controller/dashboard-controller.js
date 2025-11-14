import { orderList, itemList } from "../db/db.js";
import { getItemByName } from "../model/item-model.js";

// Utils
const formatCurrency = (v) =>
  `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const todayString = () =>
  new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const orderTotal = (order) =>
  (order.orderedItems || []).reduce(
    (s, it) => s + (it.price || 0) * (it.qty || 0),
    0
  );

// Dashboard Calculations (Paid-only)
const getTotalRevenue = () =>
  orderList
    .filter((o) => o.orderStatus.toLowerCase() === "paid")
    .reduce((s, o) => s + orderTotal(o), 0);

const getPaidOrdersCount = () =>
  orderList.filter((o) => o.orderStatus.toLowerCase() === "paid").length;

const getCancelledNotPaidCount = () =>
  orderList.filter((o) => {
    const s = o.orderStatus.toLowerCase();
    return s === "not paid" || s === "cancelled" || s === "cancelled/returned";
  }).length;

const getItemsSoldCount = () =>
  orderList
    .filter((o) => o.orderStatus.toLowerCase() === "paid")
    .reduce(
      (s, o) =>
        s + (o.orderedItems || []).reduce((ss, it) => ss + (it.qty || 0), 0),
      0
    );

const getTodayTopSelling = (limit = 4) => {
  const today = todayString();
  const orders = orderList.filter(
    (o) =>
      o.orderStatus.toLowerCase() === "paid" &&
      o.orderDate.toLowerCase() === today.toLowerCase()
  );

  const map = {};
  orders.forEach((o) => {
    (o.orderedItems || []).forEach((it) => {
      if (!map[it.name]) map[it.name] = { qty: 0, price: it.price || 0 };
      map[it.name].qty += it.qty || 0;
      map[it.name].price = it.price || map[it.name].price;
    });
  });

  return Object.entries(map)
    .map(([name, d]) => ({ name, qty: d.qty, price: d.price }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
};

const getTodayRevenue = () =>
  orderList
    .filter(
      (o) =>
        o.orderStatus.toLowerCase() === "paid" &&
        o.orderDate.toLowerCase() === todayString().toLowerCase()
    )
    .reduce((s, o) => s + orderTotal(o), 0);

const getPendingValue = () =>
  orderList
    .filter((o) => o.orderStatus.toLowerCase() === "in process")
    .reduce((s, o) => s + orderTotal(o), 0);

const getNotPaidValue = () =>
  orderList
    .filter((o) => o.orderStatus.toLowerCase() === "not paid")
    .reduce((s, o) => s + orderTotal(o), 0);

// Rendering
const renderMetrics = () => {
  $("#revenueValue").text(formatCurrency(getTotalRevenue()));
  $("#paidOrdersValue").text(getPaidOrdersCount());
  $("#cancelledOrdersValue").text(getCancelledNotPaidCount());
  $("#itemsSoldValue").text(getItemsSoldCount());
};

const renderTopSelling = () => {
  const list = $("#topSellingList");
  list.empty();

  const items = getTodayTopSelling();
  if (items.length === 0) {
    list.append(
      `<div class="text-muted small">No top selling items today.</div>`
    );
    return;
  }

  items.forEach((it) => {
    const itemObj = getItemByName(it.name) || {};
    const price = (it.price || itemObj.itemPrice || 0).toFixed(2);

    list.append(`
      <div class="d-flex justify-content-between p-3 rounded-3" style="background:#3d4142">
        <div class="d-flex gap-3">
          <i class="fa-solid fa-box fa-lg" style="color:#bcbcff"></i>
          <div>
            <div class="fw-semibold">${it.name}</div>
            <div class="small text-muted">Price: $${price}</div>
          </div>
        </div>
        <div class="small text-muted">Sold: ${it.qty}</div>
      </div>
    `);
  });
};

const renderOverview = () => {
  $("#overviewTotalRevenue").text(formatCurrency(getTotalRevenue()));
  $("#overviewTodayRevenue").text(formatCurrency(getTodayRevenue()));
  $("#overviewPending").text(formatCurrency(getPendingValue()));
  $("#overviewLosses").text(formatCurrency(getNotPaidValue()));
};

const renderDate = () => {
  $("#dateDisplay").text(
    new Date().toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  );
};

export const renderDashboard = () => {
  renderDate();
  renderMetrics();
  renderTopSelling();
  renderOverview();
};
