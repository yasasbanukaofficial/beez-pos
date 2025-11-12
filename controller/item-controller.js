import { categoriesList } from "../db/db.js";
import {
  deleteItem,
  getItemByIndex,
  getItemByName,
  getItems,
  saveItem,
  updateItem,
} from "../model/item-model.js";
import { onClick } from "../utils/event-helper.js";
import { displayToast } from "../utils/toast.js";

let currentEditingIndex = null;

const displayCategoryCard = () => {
  $("#categoryCardWrapper").empty();
  categoriesList.forEach((category) => {
    $("#categoryCardWrapper").append(getCategoryCard(category));
  });
};

const displayItemCard = () => {
  $("#itemCardWrapper").empty();
  const items = getItems();
  items.forEach((item, index) => {
    $("#itemCardWrapper").append(getItemCard(item, index));
  });
};

const getCategoryCard = (category) => {
  return `
    <div
      class="d-flex flex-column text-dark gap-5 align-items-start justify-content-center rounded-3 px-3 "
      style="height: 10rem; background-color: ${category.categoryColor}"
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

const getItemCard = (item, index) => {
  return `
    <div class="row row-cols-1 g-2">
        <div class="col g-3">
            <div class="card bg-dark text-light border-0 rounded-3 shadow-sm h-100 item-card" data-bs-toggle="modal" data-bs-target="#itemFormModal" data-item-index="${index}" data-item-name="${item.name}">
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
  const itemIndex = $(this).data("item-index");
  currentEditingIndex = itemIndex;

  const item = getItemByIndex(itemIndex);
  const modal = $("#itemFormModal");

  modal.find("#itemName").val(item.name);
  modal.find("#itemPrice").val(item.itemPrice);
  modal.find("#itemQty").val(item.itemQty);
  modal.find("#itemStatus").val(item.availability);

  const categoryId = `#cat-${item.category.toLowerCase()}`;
  modal.find('input[name="category"]').prop("checked", false);
  modal.find(categoryId).prop("checked", true);
});

onClick("#saveItemBtn", function () {
  const form = $("#itemFormModal");

  const itemIndex = currentEditingIndex;
  const name = form.find("#itemName").val();
  const price = form.find("#itemPrice").val();
  const qty = form.find("#itemQty").val();
  const availability = form.find("#itemStatus").val();

  const categoryId = form.find('input[name="category"]:checked').attr("id");
  const categoryMap = {
    "cat-mobile": "Mobile",
    "cat-laptop": "Laptop",
    "cat-tablet": "Tablet",
    "cat-other": "Other",
  };
  const category = categoryMap[categoryId] || "Other";

  const priceAsNum = Number(price);
  const qtyAsNum = Number(qty);

  // Validation
  if (!name) return displayToast("error", "Please fill out the name field");

  if (!price || isNaN(priceAsNum) || priceAsNum <= 0 || priceAsNum > 10_000_000)
    return displayToast("error", "Please fill out the price field properly");

  if (!qty || isNaN(qtyAsNum) || qtyAsNum <= 0 || qtyAsNum > 1000)
    return displayToast("error", "Please fill out the quantity field properly");

  if (!availability)
    return displayToast("error", "Please fill out the status field properly");

  const updatedItem = {
    index: itemIndex,
    name: name,
    price: price,
    qty: qty,
    availability: availability,
    category: category,
  };

  if (!getItemByIndex(updatedItem.index)) {
    saveItem(updateItem)
      ? displayToast("success", "Added new item!")
      : displayToast("error", "Failed to add new item!");
  } else if (updateItem(updatedItem)) {
    displayToast("success", "Updated item successfully!");
    displayItemCard();
    $("#itemFormModal").modal("hide");
  }
});

onClick("#deleteItemBtn", function () {
  if (!getItemByIndex(currentEditingIndex)) {
    displayToast("error", "Item doesn't exist!");
  } else if (deleteItem(currentEditingIndex)) {
    displayToast("success", "Deleted item successfully!");
    displayItemCard();
    $("#itemFormModal").modal("hide");
  }
});

export { displayCategoryCard, displayItemCard };
