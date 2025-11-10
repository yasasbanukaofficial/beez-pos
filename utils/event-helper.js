export function onClick(selector, handler) {
  $(document).on("click", selector, handler);
}
