function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = now
    .toLocaleDateString("en-US", options)
    .replace(",", " •")
    .replace(/ /g, " ")
    .replace(" •", " • ");
  $("#dateDisplay").text(formattedDate);
}

$(document).ready(function () {
  updateDateTime();
  setInterval(updateDateTime, 60000);
});
