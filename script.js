console.log('welcome');

let userWeather=document.querySelector("[data-userWeather]");
let searchWeather=document.querySelector("[data-searchWeather]");
let grantLocation=document.querySelector(".grantLocation");
let searchLocation=document.querySelector(".searchLocation");
let loadingContainer=document.querySelector(".loadingContainer");
let userContainer=document.querySelector(".userContainer");

let currentTab=userWeather;
const API_KEY="55513e29f6257eebf53799cb35620d01";
currentTab.classList.add("currentTab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("currentTab");
        currentTab=clickedTab;
        clickedTab.classList.add("currentTab");

        if(clickedTab === searchWeather){
            userContainer.classList.remove("active");
            grantLocation.classList.remove("active");
            searchLocation.classList.add("active");
        }
        else if(clickedTab===userWeather){
            searchLocation.classList.remove("active");
            userContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userWeather.addEventListener("click",()=>{
    switchTab(userWeather);
});

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
});


function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocation.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    grantLocation.classList.remove("active");
    loadingContainer.classList.add("active");

    try{
        // alert("Wants to know your location");
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();

        loadingContainer.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingContainer.classList.remove("active")
        console.log(err);
    }
}

function renderWeatherInfo(weatherInfo){

    const cityName=document.querySelector(".city");
    const countryIcon=document.querySelector(".flag");
    const desc=document.querySelector(".weatherInfo");
    const weatherIcon=document.querySelector(".weatherIcon");
    const temp=document.querySelector(".temp");
    const windspeed=document.querySelector(".windSpeed");
    const humidity=document.querySelector(".humidity");
    const cloud=document.querySelector(".clouds");
    const rain=document.querySelector(".rain");
    const sunrise=document.querySelector(".sunrise");
    const pressure=document.querySelector(".pressure");


    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloud.innerText=`${weatherInfo?.clouds.all}%`;
    rain.innerText=`${weatherInfo?.rain?.['1h'] || "no data "}mm`;
    sunrise.textContent=`${weatherInfo?.sys?.sunrise}`;
    pressure.textContent=`${weatherInfo?.main?.pressure}hPa`;

}

function geoLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantButton=document.querySelector(".btn");
grantButton.addEventListener("click",geoLocation);

const searchForm = document.querySelector("[data-searchForm]");
const searchInput=document.querySelector("[data-searchInput");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingContainer.classList.add("active");
    userContainer.classList.remove("active");
    grantLocation.classList.remove("active");

    try{
        const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingContainer.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log(err);
    }
}


