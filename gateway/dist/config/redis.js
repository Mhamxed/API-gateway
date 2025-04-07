"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
var dotenv = require("dotenv");
dotenv.config();
// Create Redis client with proper configurations
var redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: function (times) { return Math.min(times * 50, 2000); }, // Retry strategy
});
redis.on("connect", function () {
    console.log("Connected to Redis");
});
redis.on("error", function (err) {
    console.error("Redis connection error", err);
});
exports.default = redis;
