const categories = [
  {
    icon: "mobile-icon",
    categoryColor: "#cfdddb",
    category: "Mobile",
    cateogoryItemCount: 13,
  },
  {
    icon: "laptop-icon",
    categoryColor: "#f0c8cf",
    category: "Laptop",
    cateogoryItemCount: 24,
  },
  {
    icon: "tablet-icon",
    categoryColor: "#C2DBE9",
    category: "Tablet",
    cateogoryItemCount: 21,
  },
  {
    icon: "other-icon",
    categoryColor: "#C9CAEE",
    category: "Accessories",
    cateogoryItemCount: 24,
  },
];

const displayCategoryCard = () => {
  $("#categoryCard").empty();
  categories.forEach((category) => {
    $("#categoryCard").append(getCategoryCard(category));
  });
};

const getCategoryCard = (category) => {
  return `
    <div
      class="d-flex flex-column text-dark gap-5 align-items-start justify-content-center rounded-3 px-3"
      style="width: 13rem; height: 10rem; background-color: ${category.categoryColor}"
    >
      <img
        class="mt-2"
        src="../../public/assets/media/${category.icon}.png"
        alt=""
      />
      <div class="mb-1">
        <p class="fs-4 fw-bold">${category.category}</p>
        <p class="text-muted">${category.cateogoryItemCount} items</p>
      </div>
    </div>
    `;
};

export { displayCategoryCard };
