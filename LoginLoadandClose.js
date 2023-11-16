var shadow = document.querySelector(".background-shadow")
var login = document.querySelector(".login-container")  
var newUserData = document.getElementsByClassName("login-container")[1];
const signButton = document.querySelector(".signIn-button");
const signLabel = document.querySelector("#SignLabel");

window.addEventListener("load",Load())

function Load(){
    for (let i = 0; i < 0.7; i+=0.001) {
        shadow.style.opacity = i
    }
    for (let i = 100; i > 25; i-=1) {
        login.style.top = `${i}vh`;
        
    }
}


let newUser = null;

function Close(bool){
    newUser = bool;
    if(newUser){
        for (let i = 25; i > -100; i-=1) {
            login.style.top = `${i}vh`;
        }
        for (let i = 100; i > 25; i-=1) {
            newUserData.style.top = `${i}vh`;
            
        }
        
    }
    else{
        for (let i = 25; i > -100; i-=1) {
            newUserData.style.top = `${i}vh`;
        }
        for (let i = 0.7; i > 0; i-=0.001) {
            shadow.style.opacity = i
        }
        shadow.style.display = "none";
    }


}