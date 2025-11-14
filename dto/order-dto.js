export class OrderDTO {
  // Private fields
  #customerName;
  #customerEmail;
  #orderDate;
  #orderTime;
  #orderStatus; // paid, in process, not paid
  #orderedItems; // [{ name: "Macbook", qty: 1, price: 600 }, ...]
  #paymentMethod; // Cash, Card, Wallet

  // Constructor
  constructor(
    customerName,
    customerEmail,
    orderDate,
    orderTime,
    orderStatus,
    orderedItems,
    paymentMethod
  ) {
    this.#customerName = customerName;
    this.#customerEmail = customerEmail;
    this.#orderDate = orderDate;
    this.#orderTime = orderTime;
    this.#orderStatus = orderStatus;
    this.#orderedItems = orderedItems;
    this.#paymentMethod = paymentMethod;
  }

  // Getters and Setters
  get customerName() {
    return this.#customerName;
  }

  set customerName(name) {
    this.#customerName = name;
  }

  get customerEmail() {
    return this.#customerEmail;
  }

  set customerEmail(email) {
    this.#customerEmail = email;
  }

  get orderDate() {
    return this.#orderDate;
  }

  set orderDate(date) {
    this.#orderDate = date;
  }

  get orderTime() {
    return this.#orderTime;
  }

  set orderTime(time) {
    this.#orderTime = time;
  }

  get orderStatus() {
    return this.#orderStatus;
  }

  set orderStatus(status) {
    this.#orderStatus = status;
  }

  get orderedItems() {
    return this.#orderedItems;
  }

  set orderedItems(items) {
    this.#orderedItems = items;
  }

  get paymentMethod() {
    return this.#paymentMethod;
  }

  set paymentMethod(method) {
    this.#paymentMethod = method;
  }
}
