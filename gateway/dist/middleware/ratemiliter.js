"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node = /** @class */ (function () {
    function Node(timestamp) {
        this.next = null;
        this.timestamp = timestamp;
    }
    return Node;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    LinkedList.prototype.add = function (timestamp) {
        var node = new Node(timestamp);
        if (!this.head) {
            this.head = this.tail = node;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length++;
    };
    LinkedList.prototype.removeExpired = function (expirationTime) {
        while (this.head && this.head.timestamp < expirationTime) {
            this.head = this.head.next;
            this.length--;
        }
    };
    return LinkedList;
}());
var WINDOW_SIZE = 60 * 1000; // 1-minute window
var MAX_REQUESTS = 10;
var requestLogs = new Map(); //in memory key value pairs
var slidingWindowRateLimiter = function (req, res, next) {
    var ip = req.ip || "unknown_ip";
    var now = Date.now();
    var expirationTime = now - WINDOW_SIZE;
    if (!requestLogs.has(ip)) {
        requestLogs.set(ip, new LinkedList());
    }
    var log = requestLogs.get(ip);
    // Remove expired timestamps
    log.removeExpired(expirationTime);
    // Check if request limit exceeded
    if (log.length >= MAX_REQUESTS) {
        res.status(429).json({ error: "Too many requests" });
        return;
    }
    // Add current request timestamp
    log.add(now);
    next();
};
exports.default = slidingWindowRateLimiter;
