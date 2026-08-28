
var settingsMenu = document.querySelector(".settings-menu");
var darkbtn = document.getElementById("dark-btn");

function settingsMenuToggle(){
        settingsMenu.classList.toggle("settings-menu-height");
}

darkbtn.onclick = function(){
    darkbtn.classList.toggle("dark-btn-on");
    document.body.classList.toggle("dark-theme");

if( localStorage.getItem("theme") =="light"){
    localStorage.setItem("theme", "dark");
    }
    else{
        localStorage.setItem("theme", "light");
    }
}


 
if(localStorage.getItem("theme")=="light"){
    darkbtn.classList.remove("dark-btn-on");
    document.body.classList.remove("dark-theme");
}
else if(localStorage.getItem("theme")== "dark"){
    darkbtn.classList.add("dark-btn-on");
    document.body.classList.add("dark-theme");
}

else{
    localStorage.setItem("theme", "light");
}
    console.log("hAPI.js is working!");
const API_URL = "https://people-api-1ywv.onrender.com"

console.log("Human API Backend:", API_URL);

fetch(`${API_URL}/`)
    .then(response => response.json())
    .then(data => {
        console.log("Backend response:", data);
    })
    .catch(error => {
        console.error("Backend connection failed:", error);
    });
    