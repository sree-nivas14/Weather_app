import { useEffect, useState } from "react";
import "./Weather_app.css";
import axios from "axios";
import $ from "jquery";
var worldMapData = require("city-state-country");

function App() {
  const [city_list, setcity_list] = useState([]);
  const [country_list, setcountry_list] = useState([]);
  const [city_name, setcity_name] = useState();
  const [country_name, setcountry_name] = useState();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [flag, setflag] = useState("");
  const [date, setdate] = useState("");
  const [temp, settemp] = useState("");
  const [icon, seticon] = useState("");
  const [description, setdescription] = useState("");
  const [temp_max, settemp_max] = useState("");
  const [temp_min, settemp_min] = useState("");
  const [humidity, sethumidity] = useState("");
  const [pressure, setpressure] = useState("");
  const [visibility, setvisibility] = useState("");
  const [wind, setwind] = useState("");
  const [wind_direction, setwind_direction] = useState("");
  const [sunrise, setsunrise] = useState("");
  const [sunset, setsunset] = useState("");

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  //Fetching countries
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
    const countriesList = worldMapData.getAllCountries();
    console.log(countriesList);
    setcountry_list(countriesList);
  }, []);

  //Automatically fetching the location
  const success = (pos) => {
    const crd = pos.coords;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&exclude=daily&appid=bf6e8230d811d82687305e289bcf5882`
      )
      .then(async (response) => {
        document.getElementById("country").value = response.data.sys.country;
        await country_change();
        setcity_name(response.data.name);
        document.getElementById("city").value = response.data.name;
        setTimeout(() => {
          document.getElementById("submit").click();
        }, 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Permission not granted
  function error(err) {
    $(".alert-primary").show();
    console.warn(`ERROR(${err.code}): ${err.message}`);
    $(".alert-primary")
      .fadeTo(5000, 500)
      .slideUp(500, function () {
        $(".alert-primary").slideUp(500);
      });
  }

  //Fetching cities based on selected country
  const country_change = async () => {
    reset_value();
    var target_value = "";
    var target_text = "";
    target_value = $("#country option:selected").val();
    target_text = $("#country option:selected").text();
    console.log("target_value:", target_value);
    console.log("target_text:", target_text);
    if (target_value != "") {
      document.getElementById("fp-container").style.visibility = "visible";
      const countries = await axios
        .post("https://countriesnow.space/api/v0.1/countries/cities", {
          country: target_text,
        })
        .then((response) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          setcity_list(response.data.data);
        })
        .catch(function (error) {
          document.getElementById("fp-container").style.visibility = "hidden";
          alert(error.response.data.msg);
          setcity_list([]);
          reset_value();
        });

      //fetching flag api
      // const countries_flag = await axios
      //   .post("https://countriesnow.space/api/v0.1/countries/flag/images", {
      //     iso2: target_value,
      //   })
      //   .then(function (response) {
      //     console.log("3");

      //     document.getElementById("fp-container").style.visibility= "hidden";
      //     setflag_value(response.data.data.flag);
      //   })
      //   .catch(function (error) {
      //     document.getElementById("fp-container").style.visibility= "hidden";
      //     alert(error.response.data.msg);
      //   });
    } else {
      reset_value();
    }
  };

  //Fetching weather data based on chooosed cities
  function handlesubmit() {
    var country = document.getElementById("country").value;
    var city = document.getElementById("city").value;
    // console.log(country + " " + city);
    if (country && city) {
      document.getElementById("fp-container").style.visibility = "visible";
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=bf6e8230d811d82687305e289bcf5882&units=metric`
        )
        .then((response) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          setCity(response.data.name);
          setCountry(response.data.sys.country);
          setdate(response.data.dt);
          settemp(response.data.main.temp);
          settemp_max(response.data.main.temp_max);
          settemp_min(response.data.main.temp_min);
          seticon(response.data.weather[0].icon);
          setdescription(response.data.weather[0].main);
          sethumidity(response.data.main.humidity);
          setpressure(response.data.main.pressure);
          setvisibility(response.data.visibility);
          setwind(response.data.wind.speed);
          setwind_direction(response.data.wind.deg);
          setsunrise(response.data.sys.sunrise);
          setsunset(response.data.sys.sunset);
          setflag(response.data.sys.country.toLowerCase());
        })
        .catch((error) => {
          document.getElementById("fp-container").style.visibility = "hidden";
          console.log(error);
          alert(error.response.data.message);
          reset_value();
        });
    } else {
      alert("Please select Country and City");
      reset_value();
    }
  }

  //Reseting value
  function reset_value() {
    setCity();
    setCountry();
    setdate();
    settemp();
    settemp_max();
    settemp_min();
    seticon();
    setdescription();
    sethumidity();
    setpressure();
    setvisibility();
    setwind();
    setwind_direction();
    setsunrise();
    setsunset();
    setflag();
  }

  return (
    <div className="App">
      <div
        class="container col-md-8 alert alert-primary
alert-dismissible fade show text-center"
        role="alert"
        style={{ display: "none" }}
      >
        If you grant access to the Location, it automatically shows weather
        information of your current location.
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      <>
        <div className="container col-sm-12 col-md-6  card">
          <h1 className="text-center my-3">Weather App</h1>
          <div
            className="row justify-content-around align-items-center my-2"
            style={{ padding: "0 10px" }}
          >
            <div className="col-xl-4 m-2">
              <select
                id="country"
                className="custom-select"
                onChange={(e) => country_change()}
                value={country_name}
              >
                <option value="">Please Select Country</option>
                {country_list.map((e) => (
                  <option value={e.iso2}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="col-xl-4 m-2">
              <select
                id="city"
                className="custom-select"
                onChange={(e) => setcity_name(e.target.value)}
                value={city_name}
              >
                <option value="">Please Select City</option>
                {city_list.sort().map((e) => (
                  <option value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="col-xl-3 text-center">
              <input
                type="submit"
                className="btn btn-primary"
                id="submit"
                onClick={handlesubmit}
              />
            </div>
          </div>
          <div
            className="card mx-2 my-2 p-3 mx-4 center_card"
            style={{ backgroundColor: "#f1f1f1" }}
          >
            <div>
              <span className="fw-bold display-6 city_name">
                {city ? city : "-"} , {country ? country : "-"}
                {flag ? (
                  <span className="flag_div mx-1">
                    <img
                      src={"https://flagcdn.com/" + flag + ".svg"}
                      alt="flag"
                    />
                  </span>
                ) : (
                  ""
                )}
                . Weather
              </span>
              <br />
              <span className="cur_date">
                As of{" "}
                {date ? new Date(date * 1000).toLocaleTimeString("en-IN") : "-"}
              </span>
            </div>
            <div
              className="d-flex justify-content-center
align-items-end temp_data"
            >
              <div className="temp">{temp ? Math.round(temp) + "°" : "-"}</div>
              <div className="d-flex flex-column">
                {icon ? (
                  <img
                    src={"http://openweathermap.org/img/wn/" + icon + "@2x.png"}
                    width="100"
                    height="100"
                    className="icon"
                  ></img>
                ) : (
                  ""
                )}
                <div className="description">
                  {description ? description : "-"}
                </div>
              </div>
            </div>
            <h6 className="mt-2">{description ? description : "-"}</h6>
          </div>
          <div>
            <div class="main_cards">
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>High/Low</small>
                  <b>
                    {temp_max ? Math.round(temp_max) : "-"}/
                    {temp_min ? Math.round(temp_min) : "-"}
                  </b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Wind</small>
                  <b>{wind ? Math.round(wind / 0.277778) + "km/hr" : "-"}</b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Humidity</small>
                  <b>{humidity ? humidity + "%" : "-"}</b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Wind Directions</small>
                  <b>{wind_direction ? wind_direction + "°deg" : "-"}</b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Pressure</small>
                  <b>{pressure ? pressure + " hpa" : "-"}</b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Sunrise</small>
                  <b>
                    {sunrise
                      ? new Date(sunrise * 1000).toLocaleTimeString("en-IN")
                      : "-"}
                  </b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Visibility</small>
                  <b>{visibility ? visibility / 1000 + "km" : "-"}</b>
                </div>
              </div>
              <div class="details_card">
                <div
                  className="d-flex justify-content-between
align-items-center"
                >
                  <small>Sunset</small>
                  <b>
                    {sunset
                      ? new Date(sunset * 1000).toLocaleTimeString("en-IN")
                      : "-"}
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="fp-container"
          id="fp-container"
          style={{ visibility: "hidden" }}
        >
          <i
            className="fas fa-spinner fa-pulse fp-loader"
            style={{ fontSize: "70px" }}
          ></i>
        </div>
      </>
    </div>
  );
}

export default App;
