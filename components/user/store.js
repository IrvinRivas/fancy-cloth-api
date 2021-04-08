const mysql = require('mysql');
const config = require('../../config');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host:config.mysql.host,
    user:config.mysql.user,
    password:config.mysql.password,
    database:config.mysql.database
})

const addAuth = (data) => {
    return new Promise((resolve,reject) => {
        connection.query('INSERT INTO AUTH SET ?',data,(err,results) => {
            if(err){
                reject('error al agregar el auth')
            }else{
                resolve('Registro Existoso');
            }
        })
    })
}

const emailVerify = (email) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM AUTH WHERE EMAIL='${email}'`,(err,results) => {
            if(results.length > 0){
                reject('Email en uso')
            }else{
                resolve()
            }
        })
    })
}

const addUser = (auth,user) => {
    return new Promise((resolve,reject) => {
        emailVerify(auth.email)
            .then(() => {
                connection.query('INSERT INTO USERS SET ?',user,(err,results) => {
                    if(err){
                        reject('error al agregar el usuario')
                    }else{
                        addAuth(auth)
                            .then(data => resolve(data))
                    }
                })
            })
            .catch(err => reject(err))
    })
}

const getUserFromEmail = (email) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM USERS WHERE EMAIL='${email}'`,(err,results) => {
            if (!err) {
                resolve(results)
            }else{
                reject('error al traer el usuario')
            }
        })
    })
}

const login = (data) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM AUTH WHERE EMAIL='${data.email}'`,(err,results) => {
            if(results.length > 0){
                const hash = results[0].password;
                const password = data.password;
                bcrypt.compare(password,hash,(err,hashed) => {
                    if (hashed) {
                        getUserFromEmail(data.email)
                            .then((data) => resolve(data[0]))
                    }
                    else{
                        reject('Contraseña incorrecta')
                    }
                })
            }else{
                reject('Este email no existe')
            }
        })
    })
}

const updateAddress = (data,id) => {
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE USERS SET ? WHERE ID='${id}'`,data,(err,results) => {
            if (err){
                reject('Error al actualizar los datos')
            }else{
                resolve('Direccion Actualizada correctamente')
            }
        })
    })
}

const adminLogin = (data) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM ADMIN WHERE USER='${data.user}'`,(err,results) => {
            if (!err) {
                const hash = results[0].password;
                const password = data.password;
                bcrypt.compare(password,hash,(err,hashed) => {
                    if (hashed) {
                        resolve('login correcto')
                    }else{
                        reject('contraseña incorrecta')
                    }
                })
            }
        })
    })
}

const userVerify = (user) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM ADMIN WHERE USER='${user}'`,(err,results) => {
            if (results.length > 0) {
                reject('username en uso')
            }else{
                resolve(true)
            }
        })
    })
}

const adminRegister = (data) => {
    return new Promise((resolve,reject) => {
        userVerify(data.user)
            .then(() => {
                connection.query('INSERT INTO ADMIN SET ?',data,(err,results) => {
                    if (err) {
                        reject('Error al registrar administrador')
                    }else{
                        resolve('Registro Exitoso');
                    }
                })
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    add: addUser,
    login,
    updateAddress,
    admin: adminLogin,
    adminRegister
}