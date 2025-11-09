import { getUsers } from "../model/user-model.js";

const $mainContent = $("#mainWrapper");
const pinNumbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, "<-", 0, "->"];

$(function () {
  let isUserLoggedIn = false;

  const loadContent = (path) => {
    $mainContent.load(path, () => {
      let userList = getUsers();
      $("#userCard").html(
        userList
          .map(
            (user, index) =>
              `<button
                class="btn btn-dark rounded-3 w-100 d-flex align-items-center gap-4 px-4 py-3 user-card-btn"
                data-index=${index}
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
    });
  };

  if (!isUserLoggedIn) {
    loadContent("./views/login.html");
  } else {
    loadContent("./dashboard.html");
  }
});

const displayPinNumbers = () => {
  let $wrapper = $("#btnWrapper");
  let $currentRow;

  $wrapper.empty();

  pinNumbers.map((number, index) => {
    if (index % 3 === 0) {
      $currentRow = $(
        '<div class="row text-center gap-2 gap-md-5 gap-lg-5 justify-content-center"></div>'
      );
      $wrapper.append($currentRow);
    }
    const $btn = $(
      `<button
        class="btn btn-dark border-0 fs-3 fw-bold key"
        style="background-color: #3d4142"
      >
        ${number.toString()}
      </button>`
    );
    $currentRow.append($btn);
  });
};
