import { displayCategoryCard } from "../../controller/item-controller.js";
import displayDate from "../../utils/date-display.js";
import { onClick } from "../../utils/event-helper.js";
import loadView from "../../utils/loader.js";

onClick(".dashboardBtn", () => {
  changeBtnClasses(".dashboardBtn");
  loadView("#rightCol", "./views/pages/dashboard.html", displayDate);
});

onClick(".customerBtn", () => {
  changeBtnClasses(".customerBtn");
  loadView("#rightCol", "./views/pages/customer.html", displayDate);
});

onClick(".itemsBtn", () => {
  changeBtnClasses(".itemsBtn");
  loadView("#rightCol", "./views/pages/item.html", () => {
    displayDate();
    displayCategoryCard();
  });
});

onClick(".checkoutBtn", () => {
  changeBtnClasses(".checkoutBtn");
  loadView("#rightCol", "./views/pages/checkout.html", displayDate);
});

const changeBtnClasses = (activeBtn) => {
  const btnList = [
    ".dashboardBtn",
    ".customerBtn",
    ".itemsBtn",
    ".checkoutBtn",
  ];
  btnList.forEach((btn) => {
    if (activeBtn != btn) {
      $(btn).removeClass("active");
    } else {
      $(btn).addClass("active");
    }
  });
};
