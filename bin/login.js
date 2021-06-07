const config = require("../config/default.json");
const tokenService = require("./token-service");
const rp = require("request-promise")

module.exports = async ({username, password, domain}) => {
    try{
        let session_in4 = await tokenService.getToken();
        if(session_in4.token && session_in4.expire_at > Date.now()){
            console.log("You are logged in.")
        } else {
            let response_login = await rp({
                uri: `${config.backend_endpoint}/api/login`,
                method: 'POST',
                body: {
                    user_name: username,
                    password,
                    domain
                },
                json: true
            })
            if(response_login.success){
                await tokenService.updateToken(response_login.data.token);
                console.log("Login success.")
            }else {
                console.error(response_login.reason)
            }
        }
    }
    catch(e){
        console.log(e.message)
    }
}