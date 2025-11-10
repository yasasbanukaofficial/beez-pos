import loadView from "../../utils/loader.js";
import { loadLoginContent } from "../../controller/login-controller.js";
import { sessionController } from "../../controller/session-controller.js";

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
  $(rightCol).removeClass("col-12").addClass("col-10");
  loadNavbar();
  loadView(rightCol, "./views/pages/dashboard.html");
};

const loadPage = () => {
  let isUserLoggedIn = sessionController.getSessionItem("loggedIn") === "true";
  isUserLoggedIn ? loadDashboard() : loadLogin();
};

loadPage();

$(document).on("user:loggedIn", () => {
  loadDashboard();
});
