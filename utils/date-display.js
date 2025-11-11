export default function displayDate() {
  const dateObj = new Date();
  const date = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dateObj.getDay()];

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][dateObj.getMonth()];

  const day = new Date().getDate();
  const ordinal =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");
  $("#dateDisplay").text(
    date + " " + ordinal + " ● " + month + " " + dateObj.getFullYear()
  );
}
