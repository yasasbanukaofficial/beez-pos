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
  loadView("#rightCol", "./views/pages/item.html");
});

onClick("#checkoutBtn", () => {
  loadView("#rightCol", "./views/pages/checkout.html");
});
