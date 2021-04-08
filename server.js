const express = require('express');
const config = require('./config');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const cloth = require('./components/cloth/network');
const users = require('./components/user/network');
const orders = require('./components/orders/network');
const stock = require('./components/stock/network');

app.use('/cloth',cloth);
app.use('/users',users);
app.use('/orders',orders);
app.use('/stock',stock);

app.listen(config.dev.port)

console.log(`API ESCUCHANDO EN: ${config.dev.host}${config.dev.port}`);