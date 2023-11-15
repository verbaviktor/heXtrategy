var picker  = document.getElementById("picker");
let color = ""
function Colorchange(){
    document.getElementById("Hexlogo").style.color = picker.value
    document.querySelector(".signIn-button").style.backgroundColor = picker.value
    color = `${picker.value}`
    if(picker.value == "#000000"){
        document.querySelector(".signIn-button").style.color = "#ffffff"
    }
    else{
        document.querySelector(".signIn-button").style.color = "#000000"
    }
}
