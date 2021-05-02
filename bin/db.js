const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// module.exports.init = async () => {
//     let connection = await connect();
//     let user = await getUser([])
//     console.log({user})
//     connection.close();
// }

async function checkLogin({connection}){
    let check = true;
    let user = await getUser({connection: connection, params: []})
    if(!user || Date.now() - user.created_at >= (60 * 60 * 1000)){
        if(!user){
            console.log("You need to login first")
        }
        if(Date.now() - user.created_at >= (60 * 60 * 1000)){
            console.log("Token expired. Please login again.")
        } 
        check = false;
    }
    return {is_authenticated: check, user};
}

async function getUser({connection, params}){
    let user = await findOne({connection, sql: `select * from users`, params: params});
    return user 
}

async function putUser({connection, params}){
    let user = await run({connection, sql: `update users set token = ?, created_at = ? where name = ?`, params: params});
    return user 
}

async function deleteUser({connection, params}){
    await run({connection,  sql: "delete from users where name = ?", params})
}

async function postUser({connection, params}){
    await run({connection,  sql: "insert into users(id, name, token, created_at) values(?, ?, ?, ?)", params})
}

async function deleteEndpoints({connection}){
    await run({connection, sql: "delete from endpoints", params: []})
}

async function postEndpoint({connection, params}){
    await run({connection, sql: "insert into endpoints(name, url) values(?, ?)", params: params})
}

function findAll({connection, sql, params}){
    return new Promise((resolve, reject) => {
        connection.all(sql, params, (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        })
    })
}

function findOne({connection, sql, params}){
    return new Promise((resolve, reject) => {
        connection.get(sql, params, (err, rows) => {
            if(err){
                reject(err)
            }
            resolve(rows);
        })
    })
} 

function run({connection, sql, params}){
    return new Promise((resolve, reject) => {
        connection.run(sql, params, (err) => {
            if(err){
                reject(err)
            }
            resolve();
        })
    })
}


function connect(){
    return new Promise((resolve, reject) => {
        let connection = new sqlite3.Database(path.resolve(__dirname, 'openstack.db'), (err) => {
            if (err) {
              reject(err)
            }
            resolve(connection)
          });
          
    })
}



module.exports = {
    connect,
    checkLogin,
    getUser,
    deleteUser,
    postUser,
    putUser,
    deleteEndpoints,
    postEndpoint
}