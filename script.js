const apikey = "a0740a41629a27699d17d3ddf2b32092";
const url = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";

let getvalue = document.getElementById("locationInput");
let searchbox = document.querySelector(".search");
let searchbtn = document.querySelector(".submitbtn");
let weatherIcon = document.querySelector(".icon");
// after  any error find change this down comand line
let app = document.querySelector(".app");
// let app=document.querySelector('.weather-app')
let timeE1 = document.querySelector(".time");

let dateE1 = document.querySelector(".date");
let locationbtn = document.querySelector(".locationbtn"); //current location btn

const weekday = ["Sun", "Mon", "Tus", "wednesday", "Thu", "Fri"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();

  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 12 ? hour % 12 : hour; //u can change hear 24 or 12 format hour
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeE1.innerHTML = hoursIn12HrFormat + ":" + minutes + " " + `${ampm}`;
  dateE1.innerHTML =
    weekday[day] + " " + months[month] + " " + date + " " + year;
}, 1000);

async function checkweather(city) {
  const response = await fetch(url + city + `&appid=${apikey}`);

  if (response.status == 404) {
    // if want kept or delete this after u customize or not
    document.querySelector(".Cityname").innerHTML = "Invaild city";
    document.querySelector(".country").innerHTML = "";
    // --end
    alert("Invaild city");
    return;
  }

  if (response.status == 400) {
    alert("Please Enter City Name");
    return;
  } else {
    var data = await response.json();
    console.log(data);

    document.querySelector(".cityName").innerHTML = data.name;
    document.querySelector(".Cityname").innerHTML = data.name + " &nbsp-&nbsp ";
    document.querySelector(".country").innerHTML = data.sys.country;

    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°";
    document.querySelector(".Humidity").innerHTML = data.main.humidity + "%";

    document.querySelector(".Wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".condition").innerHTML = data.weather[0].main;

    document.querySelector(".cloud").innerHTML = data.weather[0].description;

    if (data.weather[0].description == "scattered clouds") {
      weatherIcon.src = "/images/cloudy.png";
      app.style.backgroundImage = "url(/images/day/dayclouds.jpg)";
    } else if (data.weather[0].description == "broken coluds") {
      weatherIcon.src = "/images/cloudy.png";
      app.style.backgroundImage = "url(/images/day/broken-clouds.jpg)";
    } else if (data.weather[0].description == "overcast clouds") {
      weatherIcon.src = "/images/cloudy.png";
      app.style.backgroundImage = "url(/images/day/overcast-cloud.jpg)";
    } else if (data.weather[0].description == "thunderstorm with rain") {
      weatherIcon.src = "/images/cloudy.png";
      app.style.backgroundImage = "url(/images/day/thunderstorm.jpg)";
    } else if (data.weather[0].description == "few clouds") {
      weatherIcon.src = "/images/cloudy.png";
      app.style.backgroundImage = "url(/images/day/few-clouds.jpg)";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "/images/clear.png";
      app.style.backgroundImage = "url(/images/day/daytime.jpg)";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "/images/rain1.png";
      app.style.backgroundImage = "url(/images/day/raindrops.jpg)";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "/images/drizzle.png";
      app.style.backgroundImage = "url(/images/day/drizzle.jpg)";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "/images/mist.webp";
      app.style.backgroundImage = "url(/images/day/mist.jpg)";
    } else if (data.weather[0].main == "Snow") {
      weatherIcon.src = "/images/snow.png";
      app.style.backgroundImage = "url(/images/night/snow-3.jpg)";
    }
  }
}
/// current location start ===============
const getuserlocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const reverse_geocoding_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apikey}`;

      //get city name from coordinates using reverse geocoding API
      fetch(reverse_geocoding_url)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          checkweather(name, latitude, longitude);
          console.log(data);
        })
        .catch(() => {
          //
          alert("error occured while fecthing the city");
        });
    },
    (error) => {
      //Permission_Denied is key name for error alert
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolaction request denied.please reset location permisson to grant access again"
        );
      }
    }
  );
};

locationbtn.addEventListener("click", getuserlocation); /// location btn event listner
////==================

searchbtn.addEventListener("click", () => {
  checkweather(searchbox.value);
  return (searchbox.value = "");
});
