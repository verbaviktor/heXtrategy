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
        username: name
    }
    const fetchedData = await fetch("https://darkauran.hu:6969/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    console.log(await fetchedData.json())
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}