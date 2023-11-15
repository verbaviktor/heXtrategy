var shadow = document.querySelector(".background-shadow")
var login = document.querySelector(".login-container")

window.addEventListener("load",Load())

function Load(){
    for (let i = 0; i < 0.7; i+=0.001) {
        shadow.style.opacity = i
    }
    for (let i = 100; i > 25; i-=1) {
        login.style.top = `${i}vh`;
        
    }
}

const SignButton = document.querySelector(".signIn-button");

// SignButton.addEventListener("click", Close())

function Close(){
    for (let i = 25; i > -100; i-=1) {
        login.style.top = `${i}vh`;
    }
    for (let i = 0.7; i > 0; i-=0.001) {
        shadow.style.opacity = i
    }
    shadow.style.transition = `0s`;
    login.style.transition = `0s`;
}