let customerList = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith", email: "bob@example.com" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
];

let itemList = [
  { id: 101, name: "Macbook Pro 14", price: 1999.0, stock: 5 },
  { id: 102, name: "iPad Air 5th Gen", price: 599.0, stock: 12 },
  { id: 103, name: "AirPods Pro 2", price: 249.0, stock: 30 },
  { id: 104, name: "Apple Watch SE", price: 279.0, stock: 8 },
];

const getCustomers = () => customerList;
const saveCustomer = (customer) => {
  const newId =
    customerList.length > 0 ? customerList[customerList.length - 1].id + 1 : 1;
  customerList.push({ id: newId, ...customer });
  return true;
};
const getItems = () => itemList;

export { getCustomers, saveCustomer, getItems };
