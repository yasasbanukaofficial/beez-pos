import { getUsers } from "../model/user-model.js";
import PinInputDTO from "./pin-input-controller.js";
import { handleAuthentication } from "../controller/auth-controller.js";

// Variables
const $mainContent = $("#mainWrapper");
const pinNumbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, "<-", 0, "->"];
let pinInput;
let username;

// Load User Cards
$(function () {
  let isUserLoggedIn = false;

  const loadContent = (path) => {
    $mainContent.load(path, () => {
      let userList = getUsers();
      $("#userCard").html(
        userList
          .map(
            (user) =>
              `<button
                class="btn btn-dark rounded-3 w-100 d-flex align-items-center gap-4 px-4 py-3 user-card-btn"
                data-username='${user.username}'
                data-bs-toggle="modal" data-bs-target="#pinModal"
                >
                    <p
                        class="rounded-circle text-dark text-center align-content-center fs-1"
                        style="background-color: #f0c8cf; width: 5rem; height: 5rem"
                    >
                        ${user.username.charAt(0).toUpperCase()}
                    </p>
                    <p class="fs-4">${user.username}</p>
               </button>`
          )
          .join("")
      );
      displayPinNumbers();
      handlePinEntry();
    });
  };

  loadContent(isUserLoggedIn ? "./dashboard.html" : "./views/login.html");
});

// Display PIN Numbers
const displayPinNumbers = () => {
  renderPinBtn();
  $(document).on("click", ".key", enableSubmit);
};

function renderPinBtn() {
  let $wrapper = $("#btnWrapper");
  let $currentRow;

  $wrapper.empty();
  pinNumbers.forEach((number, index) => {
    if (index % 3 === 0) {
      $currentRow = $(
        '<div class="row text-center gap-3 gap-lg-5 justify-content-center"></div>'
      );
      $wrapper.append($currentRow);
    }

    const isSubmitButton = index === pinNumbers.length - 1;
    const $btn = $(
      `<button
        class="btn btn-dark border-0 fs-3 fw-bold key"
        style="background-color: #3d4142; width: 80px; height: 80px"
        data-digit='${number}'
        ${isSubmitButton ? "disabled" : ""}>
        ${number.toString()}
      </button>`
    );

    $currentRow.append($btn);
  });
}

// On Click & Keydown Handlers
$(document).on("hidden.bs.modal", "#pinModal", function () {
  if (pinInput) pinInput.clear();
});

$(document).on("click", ".user-card-btn", function () {
  username = $(this).data("username");
});

$(document).on("keydown", function (e) {
  const key = e.key;

  const $btn = $(".key").filter(function () {
    return (
      $(this).data("digit") == key ||
      (key === "Backspace" && $(this).data("digit") === "<-") ||
      (key === "Enter" && $(this).data("digit") === "->")
    );
  });

  if ($btn.length) {
    $btn.click();
  }
});

// Primary Handlers and functions
function handlePinEntry() {
  if (pinInput) pinInput.clear();
  pinInput = new PinInputDTO(".pin-dots");
  pinInput.onSubmit((code) => {
    let isValid = handleAuthentication(code, username);
    if (isValid) {
      $("#pinModal").modal("hide");
    } else {
      pinInput.clear();
    }
  });
}

function enableSubmit() {
  const pinLength = $(".pin-dots.dotted").length + 1;

  $(".key")
    .eq(pinNumbers.length - 1)
    .prop("disabled", pinLength < 4);
}
