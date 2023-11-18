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
    const fetchedData = await postRequest('login', '', requestBody);
    response = await fetchedData.json();
    sessionStorage.setItem('heXtrategyUserToken', response.token)
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
    var shadow = document.querySelector(".background-shadow")

    for (let i = 0; i < 0.7; i += 0.001) {
        shadow.style.opacity = i
    }
    for (let i = 100; i > 25; i -= 1) {
        login.style.top = `${i}vh`;

    }
}

function Close(newUser) {
    var login = document.querySelector(".login-container")
    var shadow = document.querySelector(".background-shadow")
    var newUserData = document.getElementsByClassName("login-container")[1];
    if (newUser) {
        for (let i = 25; i > -100; i -= 1) {
            login.style.top = `${i}vh`;
        }
        for (let i = 100; i > 25; i -= 1) {
            newUserData.style.top = `${i}vh`;
        }
    }
    else {
        newUserData.style.display = 'none';
        login.style.top = `-100vh`;
        shadow.style.opacity = 0;
        setHtmlPlayerData(response.token);
        showPlayerProfile();
        listHtmlLobbies(response.token);
    }
}
async function setHtmlPlayerData(token) {
    const playerData = await (await getRequest('getuser', token)).json()

    document.querySelector('.username').innerHTML = playerData.username
    document.querySelector('#profile-picture').src = playerData.profileUrl
    document.querySelector('.winloss').innerHTML = `${playerData.wins}W/${playerData.gamesplayed - playerData.wins}L`
}
async function listHtmlLobbies(token) {
    const lobbies = await (await getRequest('menu/getlobbies', token)).json()

    console.log(lobbies)
}

function showPlayerProfile() {
    const playerDiv = document.querySelector('.player')
    playerDiv.style.top = '0vh';
}
function hidePlayerProfile() {
    const playerDiv = document.querySelector('.player')
    playerDiv.style.top = '-20vh';
}

function sendNewPlayerData() {
    const token = sessionStorage.getItem('heXtrategyUserToken')
    const newColor = document.querySelector('#colorpicker').value.replace('#', '')
    const newUsername = document.querySelector('#usernamepicker').value
    postRequest('menu/updateUser', token, { newColor, newUsername })
    Close(false)
}
async function postRequest(url = "", authToken = "", body = {}) {
    const fetchedData = await fetch("https://darkauran.hu:6969/" + url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken,
        },
        body: JSON.stringify(body)
    })
    return fetchedData
}

async function getRequest(url = "", authToken = "") {
    const fetchedData = await fetch("https://darkauran.hu:6969/" + url, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + authToken,
        }
    })
    return fetchedData
}