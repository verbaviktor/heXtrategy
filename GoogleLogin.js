let playerReady = false;

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
        setHtmlPlayerData(localStorage.getItem('heXtrategyUserToken'));
        showPlayerProfile();
        listHtmlLobbies(localStorage.getItem('heXtrategyUserToken'));
    }
}
async function setHtmlPlayerData(token) {
    const playerData = await (await getRequest('getuser')).json()
    for (const username of document.querySelectorAll('.username.player')) {
        username.innerHTML = playerData.username
    }
    for (const picture of document.querySelectorAll('.profile-picture.player')) {
        picture.src = playerData.profileUrl
    }
    document.querySelector('.winloss').innerHTML = `${playerData.wins}W/${playerData.gamesplayed - playerData.wins}L`
}
async function listHtmlLobbies() {
    const lobbies = await (await getRequest('menu/getlobbies')).json()
    const htmlItems = document.querySelectorAll(".lobby-item")
    console.log(lobbies)
    for (let i = 0; i < Math.min(lobbies.length, 8); i++) {
        htmlItems[i].style.backgroundColor = "#1a1a1a"
        const imageField = htmlItems[i].querySelector('.lobby-image')
        imageField.src = lobbies[i].users[0].profileUrl
        const usernameField = htmlItems[i].querySelector('.lobby-username')
        usernameField.innerHTML = lobbies[i].users[0].username
    }
}
async function createLobby() {
    playerReady = false
    await postRequest('menu/createlobby');
    showPlayersLobby();
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
    const playerDiv = document.querySelector('#players-lobby')
    playerDiv.style.top = '29.5vh';
}
function hidePlayersLobby() {
    const playerDiv = document.querySelector('#players-lobby')
    playerDiv.style.top = '100vh';
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