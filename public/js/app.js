import loadView from "../../utils/loader.js";
import { loadLoginContent } from "../../controller/login-controller.js";
import { sessionController } from "../../controller/session-controller.js";
import displayDate from "../../utils/date-display.js";

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
  $(rightCol)
    .removeClass("col-12")
    .addClass("col-lg-10 col-md-12 col-12 vh-100 px-2 px-md-3");
  loadNavbar();
  loadView(rightCol, "./views/pages/item.html", displayDate);
};

const loadPage = () => {
  let isUserLoggedIn = sessionController.getSessionItem("loggedIn") === "true";
  isUserLoggedIn ? loadDashboard() : loadLogin();
};

loadPage();

$(document).on("user:loggedIn", () => {
  loadDashboard();
});
