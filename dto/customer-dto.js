export class CustomerDTO {
  // Private fields
  #name;
  #email;
  #age;
  #contact;

  // Constructor
  constructor(name, email, age, contact) {
    this.#name = name;
    this.#email = email;
    this.#age = age;
    this.#contact = contact;
  }

  // Getters and Setters
  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get age() {
    return this.#age;
  }

  set age(age) {
    this.#age = age;
  }

  get contact() {
    return this.#contact;
  }

  set contact(contact) {
    this.#contact = contact;
  }
}
