const notyf = new Notyf({ position: { x: "right", y: "top" } });

const displayToast = (toastType, msg) => {
  if (toastType === "success") notyf.success(msg);
  if (toastType === "error") notyf.error(msg);
};

export { displayToast };
