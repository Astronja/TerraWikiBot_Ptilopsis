require('dotenv');

login();

async function login() {
    const apiUrl = 'https://arknights.wiki.gg/api.php';
    const username = process.env.wikiusername;
    const password = process.env.wikiuserpassword;

    try {
        // Get login token
        const loginTokenUrl = `${apiUrl}?action=query&meta=tokens&type=login&format=json`;
        const loginTokenResponse = await fetch(loginTokenUrl);
        const loginTokenData = await loginTokenResponse.json();
        const unprocessedToken = loginTokenData.query.tokens.logintoken;
        const loginToken = encodeURIComponent(unprocessedToken);
        console.log(`Login token: ${loginToken}`);

        const checkTokenUrl = `${apiUrl}?action=checktoken&type=login&format=json&token=${loginToken}`;
        const checkTokenResponse = await fetch(checkTokenUrl);
        console.log(checkTokenResponse);
        const checkTokenData = await checkTokenResponse.json();
        console.log(checkTokenData);

        // Login
        const loginUrl = `${apiUrl}`;
        const loginParams = new URLSearchParams();
        loginParams.append('action', 'login');
        loginParams.append('format', 'json');
        loginParams.append('lgname', username);
        loginParams.append('lgpassword', password);
        loginParams.append('lgtoken', loginToken);

        const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: loginParams
        });
        
        const loginData = await loginResponse.json();

        if (loginData.login.result === 'Success') {
            // Call the editPage function after successful login
            console.log("Successfully logged in.");
        } else {
            console.error('Login failed:', loginData);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
};