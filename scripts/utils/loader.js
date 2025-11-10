export default function loadView(id, path, callback) {
  $(id).load(path, function (resp, status) {
    if (status === "success") {
      if (typeof callback === "function") callback();
    }
  });
}
