const express = require('express');
const response = require('../../response');
const controller = require('./controller');

const router = express.Router();

router.get('/order/:id',(req,res) => {
    controller.getById(req.params.id)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,404))
})

router.get('/status/:status',(req,res) => {
    controller.status(req.params.status)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,500))
})

router.get('/filter/:initial/:final/:status',(req,res) => {
    controller.getOrderFilter(req.params.initial,req.params.final,req.params.status)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,404))
})

router.get('/:user',(req,res) => {
    controller.getByUser(req.params.user)
        .then(data => response.success(req,res,data,200))
        .catch(err => response.error(req,res,err,404))
})

router.get('/products/:order',(req,res) => {
    controller.getProductsOrder(req.params.order)
        .then(data => response.success(req,res,data,200))
        .catch(err=> response.error(req,res,err,404))
})

router.get('/analitycs/all',(req,res) => {
    controller.getAmountTotal()
        .then(data => response.success(req,res,data,200))
        .then(err => response.error(req,res,err,500))
})

router.get('/analitycs/time/:initial/:final',(req,res) => {
    controller.getAmountByTime(req.params.initial,req.params.final)
        .then(data => response.success(req,res,data,200))
        .then(err => response.error(req,res,err,500))
})

router.post('/',(req,res) => {
    controller.add(req.body.data,req.body.products)
        .then(data => response.success(req,res,data,201))
        .catch(err => response.error(req,res,err,500))
})

router.post('/update/:order',(req,res) => {
    controller.update(req.params.order, req.body.data)
        .then(data => response.success(req,res,data,201))
        .catch(err => response.error(req,res,err,500))
})


module.exports = router;