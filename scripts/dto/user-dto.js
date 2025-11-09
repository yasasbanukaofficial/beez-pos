export class UserDTO {
  // Private fields
  #username;
  #email;
  #password;
  #code;

  // Constructor
  constructor(username, email, password, code) {
    this.#username = username;
    this.#email = email;
    this.#password = password;
    this.#code = code;
  }

  // Getters and Setters
  get username() {
    return this.#username;
  }

  set username(username) {
    this.#username = username;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get password() {
    return this.#password;
  }

  set password(password) {
    this.#password = password;
  }

  get code() {
    return this.#code;
  }

  set code(code) {
    this.#code = code;
  }
}
