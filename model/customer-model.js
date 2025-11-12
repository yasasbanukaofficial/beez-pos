import { CustomerDTO as Customer } from "../dto/customer-dto.js";
import { customerList as customerDB } from "../db/db.js";

const saveCustomer = (updatedCustomer) => {
  customerDB.push(
    new Customer(
      updatedCustomer.name,
      updatedCustomer.email,
      updatedCustomer.age,
      updatedCustomer.contact
    )
  );
  return true;
};

const updateCustomer = (updatedCustomer) => {
  if (updatedCustomer.index < 0 || updatedCustomer.index >= customerDB.length)
    return false;

  customerDB[updatedCustomer.index] = {
    name: updatedCustomer.name,
    email: updatedCustomer.email,
    age: updatedCustomer.age,
    contact: updatedCustomer.contact,
  };

  return true;
};

const deleteCustomer = (i) => customerDB.splice(i, 1);

const getCustomers = () => customerDB;

const getCustomerByIndex = (i) => customerDB[i];

const getCustomerByName = (name) => {
  return getCustomers().find((customer) => customer.name === name);
};

const getCustomerBySearchInput = (name) => {
  const customers = getCustomers();

  if (!name) return customers;

  const query = name.toString().toLowerCase().trim();

  return customers.filter(
    (customer) => customer.name && customer.name.toLowerCase().includes(query)
  );
};

export {
  saveCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerByIndex,
  getCustomerByName,
  getCustomerBySearchInput,
};
