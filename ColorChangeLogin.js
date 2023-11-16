var picker  = document.getElementById("picker");
var button = document.querySelector("#startButton")
let color = ""
function Colorchange(){
    document.getElementById("Hexlogo").style.color = picker.value
    button.style.backgroundColor = picker.value
    color = `${picker.value}`
    if(picker.value == "#000000"){
        button.style.color = "#ffffff"
    }
    else{
        button.style.color = "#000000"
    }
}
