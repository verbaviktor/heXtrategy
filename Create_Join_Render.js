var menuContainer = document.createElement('div');
menuContainer.className = "menu-container"

var button = document.createElement('div');
button.className = "button start"

var text = document.createElement('div');
text.className = "text"
text.textContent = "Start"

var divSlider = document.createElement("div");
divSlider.className = "divSlider"

var slider = document.createElement('input')
slider.type = "range"
slider.min = 1;
slider.max = 100;
slider.value = 40;
slider.className = "slider"



document.querySelector("body").appendChild(menuContainer);
document.querySelector(".menu-container").appendChild(button);
document.querySelector(".start").appendChild(text);
document.querySelector(".menu-container").appendChild(divSlider)
document.querySelector(".divSlider").appendChild(slider)

export function CreateLobbyStart(){
    for (let index = -100; index < 1; index++) {
        
        document.getElementsByClassName('menu-container')[0].style.top = `${index}vh`;
        
        
    }
}

export function JoinLobbyStart(){

}