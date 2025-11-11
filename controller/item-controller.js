import { categoriesList } from "../db/db.js";
import { getItems } from "../model/item-model.js";

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
        alt=""
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
            <div class="card bg-dark text-light border-0 rounded-3 shadow-sm h-100">
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

export { displayCategoryCard, displayItemCard };
