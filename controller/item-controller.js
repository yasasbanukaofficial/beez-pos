import { categoriesList } from "../db/db.js";
import { getItemByName, getItems } from "../model/item-model.js";
import { onClick } from "../utils/event-helper.js";

const displayCategoryCard = () => {
  $("#categoryCardWrapper").empty();
  categoriesList.forEach((category) => {
    $("#categoryCardWrapper").append(getCategoryCard(category));
  });
};

const displayItemCard = () => {
  $("#itemCardWrapper").empty();
  const items = getItems();
  items.forEach((item) => {
    $("#itemCardWrapper").append(getItemCard(item));
  });
};

const getCategoryCard = (category) => {
  return `
    <div
      class="d-flex flex-column text-dark gap-5 align-items-start justify-content-center rounded-3 px-3 "
      style="width: 13rem; height: 10rem; background-color: ${category.categoryColor}"
    >
      <img
        class="mt-2"
        src="./public/assets/media/${category.icon}.png"
        alt="${category.icon}"
      />
      <div class="mb-1">
        <p class="fs-4 fw-bold">${category.category}</p>
        <p class="text-muted">${category.cateogoryItemCount} items</p>
      </div>
    </div>
    `;
};

const getItemCard = (item) => {
  return `
    <div class="row row-cols-1 g-2">
        <div class="col g-3">
            <div class="card bg-dark text-light border-0 rounded-3 shadow-sm h-100 item-card" data-bs-toggle="modal" data-bs-target="#itemFormModal" data-item-name="${item.name}">
                <div class="border-3 rounded-top" style="border-top: 1px solid #C9CAEE;"></div>
                <div class="card-body p-3">
                    <div class="mb-2">
                        <small class="text-muted">${item.category}</small>
                    </div>
                    <h6 class="card-title fw-bold mb-1" style="font-size: 0.9rem">
                        ${item.name}
                    </h6>
                    <p class="mb-3 small text-muted">$${item.itemPrice}</p>
                    <div class="d-flex align-items-center">
                        <div class="me-auto">
                            <small class="text-muted">${item.availability}</small>
                        </div>
                        <div>
                            <span class="badge rounded-pill bg-light text-dark px-3 py-2">${item.itemQty}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


  `;
};

onClick(".item-card", function () {
  const itemName = $(this).data("item-name");
  const item = getItemByName(itemName);
  console.log(item);

  const modal = $("#itemFormModal");

  modal.find("#itemName").val(item.name);
  modal.find("#itemPrice").val(item.itemPrice);
  modal.find("#itemQty").val(item.itemQty);
  modal.find("#itemStatus").val(item.availability);

  const categoryId = `#cat-${item.category.toLowerCase()}`;
  modal.find('input[name="category"]').prop("checked", false);
  modal.find(categoryId).prop("checked", true);
});

export { displayCategoryCard, displayItemCard };
