export function onClick(selector, handler) {
  $(document).on("click", selector, handler);
}

export function onkeyDown(selector, handler) {
  $(document).on("keydown", selector, handler);
}
