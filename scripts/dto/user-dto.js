export class UserDTO {
  // Private fields
  #username;
  #email;
  #password;

  // Constructor
  constructor(username, email, password) {
    this.#username = username;
    this.#email = email;
    this.#password = password;
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
}
