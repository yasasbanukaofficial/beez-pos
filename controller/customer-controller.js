import { categoriesList } from "../db/db.js";
import {
  deleteCustomer,
  getCustomerByIndex,
  getCustomerBySearchInput,
  getCustomers,
  saveCustomer,
  updateCustomer,
} from "../model/customer-model.js";
import { onClick, onkeyDown } from "../utils/event-helper.js";
import { displayToast } from "../utils/toast.js";

let currentEditingIndex = null;

const displayCategoryCard = () => {
  $("#categoryCardWrapper").empty();
  categoriesList.forEach((category) => {
    $("#categoryCardWrapper").append(getCategoryCard(category));
  });
};

const displayCustomerCard = () => {
  $("#customerCardWrapper").empty();
  const customers = getCustomers();
  customers.forEach((customer, index) => {
    $("#customerCardWrapper").append(getCustomerCard(customer, index));
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
        <p class="text-muted">${category.cateogoryItemCount} customers</p>
      </div>
    </div>
    `;
};

const getCustomerCard = (customer, index) => {
  return `
    <div class="row row-cols-1 g-2">
        <div class="col g-3">
            <div class="card bg-dark text-light border-0 rounded-3 shadow-sm h-100 customer-card" data-bs-toggle="modal" data-bs-target="#customerFormModal" data-customer-index="${index}" data-customer-name="${customer.name}">
                <div class="border-3 rounded-top" style="border-top: 1px solid #C9CAEE;"></div>
                <div class="card-body p-3">
                    <div class="mb-2">
                        <small class="text-muted">Age: ${customer.age}</small>
                    </div>
                    <h6 class="card-title fw-bold mb-1" style="font-size: 0.9rem">
                        ${customer.name}
                    </h6>
                    <p class="mb-3 small text-muted">${customer.email}</p>
                    <div class="d-flex align-items-center">
                        <div>
                            <span class="badge rounded-pill bg-light text-dark px-3 py-2">${customer.contact}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
};

onClick(".customer-card", function () {
  const customerName = $(this).data("customer-name");
  const customerIndex = $(this).data("customer-index");
  currentEditingIndex = customerIndex;

  const customer = getCustomerByIndex(customerIndex);
  const modal = $("#customerFormModal");

  modal.find("#customerName").val(customer.name);
  modal.find("#customerEmail").val(customer.email);
  modal.find("#customerAge").val(customer.age);
  modal.find("#customerContact").val(customer.contact);
});

onClick("#saveCustomerBtn", function () {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactRegex =
    "/(?:([+]d{1,4})[-.s]?)?(?:[(](d{1,3})[)][-.s]?)?(d{1,4})[-.s]?(d{1,4})[-.s]?(d{1,9})/g";
  const form = $("#customerFormModal");

  const customerIndex = currentEditingIndex;
  const name = form.find("#customerName").val();
  const email = form.find("#customerEmail").val();
  const age = form.find("#customerAge").val();
  const contact = form.find("#customerContact").val();

  // Validation
  if (!name) return displayToast("error", "Please fill out the name field");

  if (!email || !email.match(emailRegex))
    return displayToast("error", "Please fill out the email field properly");

  const ageNum = parseInt(age);
  if (!age || isNaN(ageNum) || ageNum < 12 || ageNum > 120)
    return displayToast("error", "Please fill out a valid age (12-120)");

  if (!contact || contact.match(contactRegex))
    return displayToast("error", "Please fill out the contact field properly");

  const updatedCustomer = {
    index: customerIndex,
    name: name,
    email: email,
    age: age,
    contact: contact,
  };

  if (!getCustomerByIndex(updatedCustomer.index)) {
    saveCustomer(updatedCustomer)
      ? displayToast("success", "Added new customer!")
      : displayToast("error", "Failed to add new customer!");
  } else if (updateCustomer(updatedCustomer)) {
    displayToast("success", "Updated customer successfully!");
  }
  displayCustomerCard();
  $("#customerFormModal").modal("hide");
});

onClick("#deleteCustomerBtn", function () {
  if (!getCustomerByIndex(currentEditingIndex)) {
    displayToast("error", "Customer doesn't exist!");
  } else if (deleteCustomer(currentEditingIndex)) {
    displayToast("success", "Deleted customer successfully!");
    displayCustomerCard();
    $("#customerFormModal").modal("hide");
  }
});

onkeyDown("#searchInput", (e) => {
  const value = $("#searchInput").val();
  if (e.key === "Backspace" || !value) {
    displayCustomerCard();
  } else {
    const searchRslt = searchCustomer(value);
    $("#customerCardWrapper").empty();
    searchRslt.forEach((customer, index) => {
      $("#customerCardWrapper").append(getCustomerCard(customer, index));
    });
  }
});

const searchCustomer = (value) => {
  return getCustomerBySearchInput(value);
};

export { displayCategoryCard, displayCustomerCard };
