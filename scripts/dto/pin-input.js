export default class PinInputDTO {
  #pinCode;
  #maxLength;
  #dots;

  constructor(dotSelector, maxLength = 4) {
    this.#pinCode = "";
    this.#maxLength = maxLength;
    this.#dots = $(dotSelector);
    this.init();
  }

  init() {
    const self = this;

    $(document).on("click", ".key", function () {
      const key = $(this).data("digit");

      if (key >= 0 && key <= 9) {
        self.addDigit(key);
      } else if (key === "<-") {
        self.backspace();
      } else if (key === "->") {
        self.submit();
      }
    });
  }

  addDigit(digit) {
    if (this.#pinCode.length < this.#maxLength) {
      this.#pinCode += digit;
      this.updateDots();
    }
  }

  backspace() {
    this.#pinCode = this.#pinCode.slice(0, -1);
    this.updateDots();
  }

  submit() {
    console.log("PIN submitted:", this.#pinCode);
  }

  updateDots() {
    this.#dots.each((i, dot) => {
      $(dot).toggleClass("dotted", i < this.#pinCode.length);
      $(dot).toggleClass("bordered", i >= this.#pinCode.length);
    });
  }
}
