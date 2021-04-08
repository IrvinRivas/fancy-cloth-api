const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection({
    host:config.mysql.host,
    user:config.mysql.user,
    password:config.mysql.password,
    database:config.mysql.database
})

const isInInventary = (product,size) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM STOCK WHERE PRODUCT='${product}' AND SIZE='${size}'`,(err,results) => {
            if (results.length > 0) {
                resolve()
            }else{
                reject()
            }
        })
    })
}


const updateInventary = (product,size,amount) => {
    return new Promise((resolve,reject) => {
        connection.query(`UPDATE STOCK SET AMOUNT='${amount}' WHERE PRODUCT='${product}' AND SIZE='${size}'`,(err,results) => {
            if (err) {
                reject('Error al actualizar')
            }else{
                resolve('Actualizado correctamente')
            }
        })
    })
}

const addInventary = (data) => {
    return new Promise((resolve,reject) => {
        isInInventary(data.product,data.size)
            .then(() => {
                updateInventary(data.product, data.size, data.amount)
                    .then(data => resolve(data))
            })
            .catch(() => {
                connection.query(`INSERT INTO STOCK SET ?`,data,(err,results) => {
                    if (err) {
                        reject('error interno')
                    }else{
                        resolve('Producto agregado al inventario')
                    }
                })
            })
    })
}


const getSizesByProduct = (product) => {
    return new Promise((resolve,reject) => {
        connection.query(`SELECT * FROM STOCK WHERE PRODUCT='${product}' AND AMOUNT > 0 ORDER BY SIZE`,(err,results) => {
            if (results.length > 0) {
                resolve(results)
            }else{
                reject('Producto no disponible')
            }
        })
    })
}

const getAll = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM STOCK',(err,results) => {
            if (results.length > 0) {
                resolve(results)
            }else{
                reject('Error interno')
            }
        })

    })
}

const getNotAvailable = () => {
    return new Promise((resolve,reject) => {
        connection.query('SELECT * FROM STOCK WHERE AMOUNT=0',(err,results) => {
            if (results.length > 0) {
                resolve(results)
            }else{
                reject('Todos los productos tienen existencia')
            }
        })
    })
}

module.exports = {
    add: addInventary,
    getSizes : getSizesByProduct,
    get: getAll,
    getNotAvailable
}