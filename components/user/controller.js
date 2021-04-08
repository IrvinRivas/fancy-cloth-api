const store = require('./store');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const addUser = async(userdata) => {
    const id = nanoid();
    const newUser = {
        id,
        name: userdata.name,
        email: userdata.email,
        country: userdata.country,
        state: userdata.state,
        city: userdata.city,
        address: userdata.address,
        cp: userdata.cp,
        phone: userdata.phone
    }

    bcrypt.genSalt(5,(err,salt) => {
        bcrypt.hash(userdata.password,salt,async(err,hash) => {
            const newAuth = {
                id,
                email: userdata.email,
                password: hash ,
            }
            return await store.add(newAuth,newUser);
        })
    })   
}

const login = async(data) => {
    return await store.login(data)
}

const updateAddress = async(data,id) => {
    return await store.updateAddress(data,id)
}

const adminLogin = async(data) => {
    return await store.admin(data);
}

const adminRegister = async(data) => {
    const id = nanoid();
    bcrypt.genSalt(5,(err,salt) => {
        bcrypt.hash(data.password,salt,async(err,hash) => {
            const admin = {
                id,
                user: data.user,
                password: hash
            }
            return await store.adminRegister(admin);
        })
    })
}

module.exports = {
    addUser,
    login,
    updateAddress,
    admin:adminLogin,
    adminRegister
}