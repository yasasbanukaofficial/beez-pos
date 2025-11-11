import displayDate from "../../utils/date-display.js";
import { onClick } from "../../utils/event-helper.js";
import loadView from "../../utils/loader.js";

onClick("#dashboardBtn", () => {
  loadView("#rightCol", "./views/pages/dashboard.html");
});

onClick("#customerBtn", () => {
  $("#dashboardBtn").removeClass("active");
  loadView("#rightCol", "./views/pages/customer.html");
});

onClick("#itemsBtn", () => {
  $("#dashboardBtn").removeClass("active");
  loadView("#rightCol", "./views/pages/item.html", displayDate);
});

onClick("#checkoutBtn", () => {
  $("#dashboardBtn").removeClass("active");
  loadView("#rightCol", "./views/pages/checkout.html");
});
