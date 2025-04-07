"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var JWT_SECRET = process.env.JWT_SECRET;
var isAdminJWT = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    var token = authHeader.split(" ")[1];
    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        var decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        if (req.user.isAdmin == false) {
            res.status(403).json({
                message: "forbidden admin access only"
            });
            return;
        }
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.default = isAdminJWT;
