const fs = require("fs");

module.exports.getToken = async () => {
    let sessin_in4 = await fs.readFileSync(__dirname + "/session-in4.txt");
    sessin_in4 = sessin_in4.toString();
    if(sessin_in4){
        sessin_in4 = JSON.parse(sessin_in4);
    }
    if(typeof sessin_in4 !== "object"){
        sessin_in4 = {

        }
    }
    return sessin_in4;
}

module.exports.updateToken = async (token) => {
    let data = {
        token: token,
        expire_at: Date.now() + 60 * 60 * 1000 
    }
    await fs.writeFileSync(__dirname + "/session-in4.txt", JSON.stringify(data))
}