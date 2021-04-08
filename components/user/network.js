const express = require('express');
const response = require('../../response');
const controller = require('./controller');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register',(req,res) => {
    controller.addUser(req.body.user)
        .then(data => response.success(req,res,data,201))
        .catch(err => response.error(req,res,err,500))
})

router.post('/login',(req,res) => {
    controller.login(req.body.data)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,404))
})

router.post('/admin/login',(req,res) => {
    controller.admin(req.body.data)
        .then(data => {
            jwt.sign({data},'secretkey',(err,token) => {
                response.success(req,res,[data,token],200)
            })
        })
        .catch(err => response.error(req,res,err,500))
})

router.post('/admin/register',(req,res) => {
    controller.adminRegister(req.body.data)
        .then(data => response.success(req,res,data,201))
        .catch(err => response.error(req,res,err,500))
})


router.post('/update',(req,res) => {
    controller.updateAddress(req.body.user,req.body.id)
        .then(data => response.success(req,res,data,201))
        .catch(err => response.error(req,res,err,500))
})


module.exports = router;