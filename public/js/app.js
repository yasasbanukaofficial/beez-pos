import loadView from "../../utils/loader.js";
import { loadLoginContent } from "../../controller/login-controller.js";
import { sessionController } from "../../controller/session-controller.js";
import displayDate from "../../utils/date-display.js";
import {
  displayCategoryCard,
  displayItemCard,
} from "../../controller/item-controller.js";
import { renderDashboard } from "../../controller/dashboard-controller.js";

// Variables
const leftCol = "#leftCol";
const rightCol = "#rightCol";

const loadNavbar = () => {
  loadView(leftCol, "./views/components/navbar.html");
};

const loadLogin = () => {
  loadView(rightCol, "./views/pages/login.html", loadLoginContent);
};

const loadDashboard = () => {
  $(leftCol).removeClass("d-none");
  $(rightCol).removeClass("col-12").addClass("col-lg-10");
  loadNavbar();
  loadView(rightCol, "./views/pages/dashboard.html", () => {
    displayDate();
    renderDashboard();
    displayUserName();
  });
};

const loadPage = () => {
  let isUserLoggedIn = sessionController.getSessionItem("loggedIn") === "true";
  isUserLoggedIn ? loadDashboard() : loadLogin();
};

loadPage();

$(document).on("user:loggedIn", () => {
  loadDashboard();
});

const displayUserName = () => {
  const loggedUserName = sessionController.getSessionItem("username");
  $(".logged-user-name").text(loggedUserName);
  $(".username-f-letter").text(loggedUserName.charAt(0));
  console.log(loggedUserName);
};
