import { getUsers } from "../model/user-model.js";
import PinInputDTO from "./pin-input-controller.js";
import { handleAuthentication } from "./auth-controller.js";
import { sessionController } from "./session-controller.js";
import displayDate from "../utils/date-display.js";

// Variables
const pinNumbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, "<-", 0, "->"];
let pinInput;
let username;

const loadLoginContent = () => {
  let userList = getUsers();
  $("#userCardWrapper").empty();
  userList.forEach((user) => {
    $("#userCardWrapper").append(getuserCardWrapper(user));
  });
  displayPinNumbers();
  handlePinEntry();
  displayDate();
};

const getuserCardWrapper = (user) => {
  return `<button
                class="btn btn-dark d-flex align-items-center gap-4 p-0 user-card-btn"
                style="border-radius: 2rem;"
                data-username="${user.username}"
                data-bs-toggle="modal"
                data-bs-target="#pinModal"
              >
                <div class="shadow bg-dark" style="width: 18rem; border-radius: 2rem;">
                  <!-- Top Graphical Area -->
                  <div
                    class="position-relative rounded-top-4 overflow-hidden"
                    style="height: 150px; border-radius: 2rem;"
                  >
                    <div
                      class="position-absolute rounded-circle"
                      style="background-color: #CFDDDB; width: 120px; height: 120px; top: -30px; left: -30px"
                    ></div>
                    <div
                      class="position-absolute rounded-circle opacity-75"
                      style="background-color: #E4CDED; width: 100px; height: 100px; bottom: -20px; right: -20px"
                    ></div>
                    <div
                      class="position-absolute rounded-circle opacity-75"
                      style="background-color: #C2DBE9; width: 90px; height: 90px; bottom: -20px; left: 40px"
                    ></div>
                    <div
                      class="position-absolute rounded-circle opacity-75"
                      style="background-color: #FFFFFF; width: 80px; height: 80px; top: 20px; right: 60px"
                    ></div>
                  </div>

                  <!-- Content -->
                  <div class="card-body text-center">
                    <div
                      class="mx-auto rounded-circle d-flex justify-content-center align-items-center fw-bold fs-2 mb-3"
                      style="width: 5rem; height: 5rem; background-color: #f0c8cf;"
                    >
                      <p>
                        ${user.username.charAt(0).toUpperCase()}
                      </p>
                    </div>
                    <h5 class="fw-bold text-white">${user.username}</h5>
                    <p class="text-muted small mb-3">Cashier Account</p>
                  </div>
                </div>
              </button>`;
};

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

$(document).on("shown.bs.modal", "#pinModal", function () {
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
});

// Primary Handlers and functions
function handlePinEntry() {
  if (pinInput) pinInput.clear();
  pinInput = new PinInputDTO(".pin-dots");
  pinInput.onSubmit((code) => {
    let isValid = handleAuthentication(code, username);
    if (isValid) {
      $("#pinModal").modal("hide");
      sessionController.saveSessionItem("loggedIn", "true");
      sessionController.saveSessionItem("username", username);
      $(document).trigger("user:loggedIn");
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

export { loadLoginContent };
