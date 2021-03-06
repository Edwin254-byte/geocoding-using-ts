// Code goes here!
import { GOOGLE_API_KEY } from "./api_key";
const mapEl = document.getElementById("map")! as HTMLDivElement;
const formEl = document.querySelector("form")! as HTMLFormElement;
const addressEl = document.getElementById("address")! as HTMLInputElement;

const renderMap = function (coords: { lat: number; lng: number }) {
  const map = new google.maps.Map(mapEl, {
    center: coords,
    zoom: 16,
  });
  new google.maps.Marker({
    position: coords,
    map: map,
  });
};

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    const coords = { lat: latitude, lng: longitude };
    renderMap(coords);
  },
  () => console.log("err occurred")
);
async function searchAddressHandler(event: Event) {
  try {
    event.preventDefault();
    const address = addressEl.value;
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        address
      )}&key=${GOOGLE_API_KEY}`
    );
    if (!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    console.log(data);
    const coords = data.results[0].geometry.location;
    renderMap(coords);
  } catch (err) {
    alert("Something went wrong...try again later");
    //console.error(err);
  }
}
formEl.addEventListener("submit", searchAddressHandler);
