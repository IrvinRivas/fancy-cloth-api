const express = require('express');
const response = require('../../response');
const controller = require('./controller');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/',(req,res) => {
    controller.get()
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,500))
})

router.get('/sizes/:product',(req,res) => {
    controller.getSizes(req.params.product)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,200))
})

router.get('/notAvailable',(req,res) => {
    controller.getNotAvailable()
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,200))
})

router.post('/',verifyToken,(req,res) => {
    jwt.verify(req.token,'secretkey',(err,data) => {
        if (err) {
            response.error(req,res,'No tienes permiso para realizar esta accion',403)
        }else{
        controller.add(req.body.data)
            .then(data => response.success(req,res,data,201))
            .catch(err => response.error(req,res,err,500))
        }
    })
})

function verifyToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next()
    }else{
        res.sendStatus(403)
    }
}

module.exports = router;