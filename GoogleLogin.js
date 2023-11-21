let playerReady = false;
let lobbies = [];
let fetchingEnemy = false;
let fetchingLobbies = false;
var fetchingGame = false;
let username = ""
var lobbyId = ""
var playerIndex = ""
var playerColor = ""
var enemyColor = ""

setInterval(async () => {
    if (fetchingEnemy) {
        let response = await getRequest('lobby/lobbyinfo')
        let responseData = await response.json()
        if (response.status == 201) {
            console.log("Lobby started")
            const startGameEvent = new CustomEvent('startGame')
            document.dispatchEvent(startGameEvent)
            fetchingEnemy = false
            fetchingGame = true
            GameStart()
        }
        else {
            playerIndex = responseData.users.findIndex((user) => user.username == username)
            setEnemyProfile(responseData)
        }
    }
    if (fetchingLobbies) {
        listHtmlLobbies()
    }
}, 2000)

async function onSignIn(googleUser) {
    const credentials = (parseJwt(googleUser.credential))
    console.log(credentials)
    let name = credentials.name
    for (const word of name.split(' ')) {
        if (word.includes('(')) {
            name = word.slice(1, word.length - 1)
            break;
        }
    }
    const requestBody = {
        googleId: credentials.sub,
        email: credentials.email,
        username: name,
        profileUrl: credentials.picture
    }
    const fetchedData = await postRequest('login', requestBody);
    response = await fetchedData.json();
    localStorage.setItem('heXtrategyUserToken', response.token)
    console.log('Session token: ' + response.token)
    Close(response.newUser)
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function Load() {
    var login = document.querySelector(".login-container")
    console.log("LOAD")
    login.style.top = `25vh`;
}

function Close(newUser) {
    var login = document.querySelector(".login-container")
    var shadow = document.querySelector(".background-shadow")
    var newUserData = document.getElementsByClassName("login-container")[1];
    if (newUser) {
        login.style.top = `-100vh`;
        newUserData.style.top = `25vh`;
    }
    else {
        newUserData.style.display = 'none';
        login.style.top = `-100vh`;
        shadow.style.opacity = 0;
        shadow.style.pointerEvents = 'none'
        setHtmlPlayerData();
        showPlayerProfile();
        listHtmlLobbies(localStorage.getItem('heXtrategyUserToken'));
        fetchingLobbies = true;
    }
}
async function setHtmlPlayerData() {
    const playerData = await (await getRequest('getuser')).json()
    username = playerData.username
    playerColor = playerData.color
    for (const username of document.querySelectorAll('.username.player')) {
        username.innerHTML = playerData.username
    }
    for (const picture of document.querySelectorAll('.profile-picture.player')) {
        picture.src = playerData.profileUrl
    }
    document.querySelector('.winloss').innerHTML = `${playerData.wins}W/${playerData.gamesplayed - playerData.wins}L`
}
async function listHtmlLobbies() {
    lobbies = await (await getRequest('menu/getlobbies')).json()
    var searchText = document.querySelector("#search").value.toUpperCase()

    const htmlItems = document.querySelectorAll(".lobby-item")
    for (let i = 0; i < 8; i++) {
        htmlItems[i].style.backgroundColor = "#5a5a5a"
        const imageField = htmlItems[i].querySelector('.lobby-image')
        imageField.src = "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png?20091205084734"
        const usernameField = htmlItems[i].querySelector('.lobby-username')
        usernameField.innerHTML = ""
        const joinButton = htmlItems[i].querySelector('.joinbutton')
        joinButton.style.opacity = 0
    }

    var searchlobbies = []
    for (const lobby of lobbies) {
        if (lobby.users[0].username.toUpperCase().includes(`${searchText}`)) {
            searchlobbies.push(lobby)
        }
    }
    for (let i = 0; i < Math.min(searchlobbies.length, 8); i++) {
        htmlItems[i].style.backgroundColor = "#1a1a1a"
        const imageField = htmlItems[i].querySelector('.lobby-image')
        imageField.src = searchlobbies[i].users[0].profileUrl
        const usernameField = htmlItems[i].querySelector('.lobby-username')
        usernameField.innerHTML = searchlobbies[i].users[0].username
        const joinButton = htmlItems[i].querySelector('.joinbutton')
        joinButton.style.opacity = 1

    }
}

async function createLobby() {
    playerReady = false;
    fetchingEnemy = true;
    const response = await postRequest('menu/createlobby');
    if (response.status != 201) {
        return
    }

    lobbyId = (await response.json()).lobbyId
    showPlayersLobby();
}
async function joinLobby(index) {
    playerReady = false;
    fetchingEnemy = true;
    await postRequest('menu/joinlobby', { lobbyId: lobbies[index].id });
    lobbyId = lobbies[index].id
    showPlayersLobby();
    const enemyProfilePicture = document.querySelector('.enemy.profile-picture');
    enemyProfilePicture.src = lobbies[index].users[0].profileUrl;
    const enemyUsername = document.querySelector('.enemy.username');
    enemyUsername.innerHTML = lobbies[index].users[0].username;
}
function setEnemyProfile(response) {
    if (response.users.length == 1) {
        const enemyProfilePicture = document.querySelector('.enemy.profile-picture');
        enemyProfilePicture.src = "https://www.htmlcsscolor.com/preview/128x128/5E5E5E.png";
        const enemyUsername = document.querySelector('.enemy.username');
        enemyUsername.innerHTML = "searching...";
        const readyButton = document.querySelector('.enemy.readybutton')
        const text = readyButton.querySelector('.text-center');
        readyButton.style.backgroundColor = '#ea4335'
        text.innerHTML = 'Not Ready'
        return
    }
    const enemy = response.users.filter((user) => user.username != username)[0]
    const enemyProfilePicture = document.querySelector('.enemy.profile-picture');
    enemyProfilePicture.src = enemy.profileUrl;
    const enemyUsername = document.querySelector('.enemy.username');
    enemyUsername.innerHTML = enemy.username;

    const readyButton = document.querySelector('.enemy.readybutton')
    const text = readyButton.querySelector('.text-center');
    if (enemy.readyState) {
        readyButton.style.backgroundColor = '#34a853'
        text.innerHTML = 'Ready'
    }
    else {
        readyButton.style.backgroundColor = '#ea4335'
        text.innerHTML = 'Not Ready'
    }

    enemyColor = enemy.color
}
function showPlayerProfile() {
    const playerDiv = document.querySelector('.playerprofile')
    playerDiv.style.top = '0vh';
}
function hidePlayerProfile() {
    const playerDiv = document.querySelector('.playerprofile')
    playerDiv.style.top = '-20vh';
}
function showPlayersLobby() {
    const readybutton = document.querySelectorAll(".readybutton")
    for (const button of readybutton) {
        button.style.opacity = 1
        button.style.pointerEvents = "all"
    }

    const playerDiv = document.querySelector('#players-lobby')
    const canvas = document.querySelector('#gamecanvas')
    playerDiv.style.top = '29.5vh';
    canvas.style.top = '0vh';
    fetchingEnemy = true
    fetchingLobbies = false
    const startRenderEvent = new CustomEvent('startRender', { detail: lobbyId })
    document.dispatchEvent(startRenderEvent)

}
async function hidePlayersLobby() {
    await postRequest("lobby/exitlobby")
    const playerDiv = document.querySelector('#players-lobby')
    const canvas = document.querySelector('#gamecanvas')
    canvas.style.top = '100vh';
    playerDiv.style.top = '100vh';
    const stopRenderEvent = new CustomEvent('stopRender')
    document.dispatchEvent(stopRenderEvent)
    fetchingEnemy = false
    fetchingLobbies = true
}
async function togglePlayerReady() {
    playerReady = !playerReady
    const readyButton = document.querySelector('.player.readybutton')
    const text = readyButton.querySelector('.text-center');
    if (playerReady) {
        readyButton.style.backgroundColor = '#34a853'
        text.innerHTML = 'Ready'
        await postRequest('lobby/ready')
    }
    else {
        readyButton.style.backgroundColor = '#ea4335'
        text.innerHTML = 'Not Ready'
        await postRequest('lobby/notready')
    }
}

async function sendNewPlayerData() {
    const token = localStorage.getItem('heXtrategyUserToken')
    const newColor = document.querySelector('#colorpicker').value.replace('#', '')
    const newUsername = document.querySelector('#usernamepicker').value
    const updateResponse = await (await postRequest('menu/updateUser', { newColor, newUsername })).json();
    localStorage.setItem('heXtrategyUserToken', updateResponse.token)
    Close(false)
}
async function postRequest(url = "", body = {}) {
    const fetchedData = await fetch("https://darkauran.hu:6969/" + url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('heXtrategyUserToken'),
        },
        body: JSON.stringify(body)
    })
    return fetchedData
}

async function getRequest(url = "") {
    const fetchedData = await fetch("https://darkauran.hu:6969/" + url, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('heXtrategyUserToken'),
        }
    })
    return fetchedData
}

async function getPlayerToken(googleId, email) {
    const requestBody = {
        googleId,
        email,
    }
    const fetchedData = await (await postRequest('login', requestBody)).json();
    return fetchedData.token
}

function GameStart() {


    const playerDiv = document.querySelector('#players-lobby')
    playerDiv.style.top = "-10vh";
    playerDiv.style.left = "-10vw";
    playerDiv.style.width = "120vw"
    playerDiv.style.height = "120vh"
    playerDiv.style.zIndex = "1"

    const readybutton = document.querySelectorAll(".readybutton")
    for (const button of readybutton) {
        button.style.opacity = 0
        button.style.pointerEvents = "none"
    }

    const gameCanvas = document.querySelector("#gamecanvas")
    gameCanvas.style.width = "100vw"
    gameCanvas.style.height = "100vh"
    gameCanvas.style.left = "10vw"
    gameCanvas.style.top = "10vh"
    gameCanvas.style.pointerEvents = "all"

    const playerprofile = document.querySelector('#ally.playerinlobby')
    playerprofile.style.top = "14vh"
    playerprofile.style.left = "20vh"
    const enemyprofile = document.querySelector('#enemy.playerinlobby')
    enemyprofile.style.top = "14vh"
    enemyprofile.style.right = "20vh"
}
async function surrender() {
    await postRequest('game/surrender')

    const playerDiv = document.querySelector('#players-lobby')
    playerDiv.removeAttribute('style')
    playerDiv.style.top = "29.5vh";

    const gameCanvas = document.querySelector("#gamecanvas")
    gameCanvas.removeAttribute('style')
    gameCanvas.style.top = "0vh"
    gameCanvas.style.pointerEvents = "all"

    const playerprofile = document.querySelector('#ally.playerinlobby')
    playerprofile.removeAttribute("style")

    const enemyprofile = document.querySelector('#enemy.playerinlobby')
    enemyprofile.removeAttribute("style")

    const stopGameEvent = new CustomEvent('stopGame')
    document.dispatchEvent(stopGameEvent)

    const exitbutton = document.querySelector(".exitButton")
    exitbutton.style.opacity = 1;
    fetchingGame = false
    fetchingLobbies = true
}

window.onbeforeunload = hidePlayersLobby;