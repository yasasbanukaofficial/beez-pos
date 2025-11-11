export class ItemDTO {
  #name;
  #category;
  #itemQty;
  #itemPrice;
  #productStatus;

  constructor(name, category, itemQty, itemPrice, productStatus) {
    this.#name = name;
    this.#category = category;
    this.#itemQty = itemQty;
    this.#itemPrice = itemPrice;
    this.#productStatus = productStatus;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get category() {
    return this.#category;
  }

  set category(category) {
    this.#category = category;
  }

  get itemQty() {
    return this.#itemQty;
  }

  set itemQty(itemQty) {
    this.#itemQty = itemQty;
  }

  get itemPrice() {
    return this.#itemPrice;
  }

  set itemPrice(itemPrice) {
    this.#itemPrice = itemPrice;
  }

  get productStatus() {
    return this.#productStatus;
  }

  set productStatus(productStatus) {
    this.#productStatus = productStatus;
  }
}
