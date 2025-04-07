"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var http_proxy_middleware_1 = require("http-proxy-middleware");
var ratemiliter_1 = require("./middleware/ratemiliter");
var rediscache_1 = require("./middleware/rediscache");
var isAdminmiddleware_1 = require("./middleware/isAdminmiddleware");
dotenv.config();
var PORT = process.env.PORT;
var app = express();
app.use(express.json()); //parse json
app.use(ratemiliter_1.default); // ip based rate limiter
app.use(rediscache_1.default);
var userProxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:8001',
    changeOrigin: true,
});
var productsProxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:8002',
    changeOrigin: true,
});
app.use('/user', userProxyMiddleware); //user service
app.use('/products', isAdminmiddleware_1.default, productsProxyMiddleware); // products service
app.listen(PORT, function () { return console.log("API gateway is listening on port: ".concat(PORT)); });
