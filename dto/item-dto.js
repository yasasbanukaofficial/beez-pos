export class ItemDTO {
  #name;
  #category;
  #itemQty;
  #itemPrice;
  #availability;

  constructor(name, category, itemQty, itemPrice, availability) {
    this.#name = name;
    this.#category = category;
    this.#itemQty = itemQty;
    this.#itemPrice = itemPrice;
    this.#availability = availability;
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

  get availability() {
    return this.#availability;
  }

  set availability(availability) {
    this.#availability = availability;
  }
}
