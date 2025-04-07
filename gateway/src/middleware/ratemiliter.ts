import { Request, Response, NextFunction } from "express";

class Node {
  timestamp: number;
  next: Node | null = null;
  
  constructor(timestamp: number) {
    this.timestamp = timestamp;
  }
}

class LinkedList {
  head: Node | null = null;
  tail: Node | null = null;
  length: number = 0;

  add(timestamp: number) {
    const node = new Node(timestamp);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }
    this.length++;
  }

  removeExpired(expirationTime: number) {
    while (this.head && this.head.timestamp < expirationTime) {
      this.head = this.head.next;
      this.length--;
    }
  }
}

const WINDOW_SIZE = 60 * 1000; // 1-minute window
const MAX_REQUESTS = 10;

const requestLogs = new Map<string, LinkedList>(); //in memory key value pairs

const slidingWindowRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || "unknown_ip";
  const now = Date.now();
  const expirationTime = now - WINDOW_SIZE;

  if (!requestLogs.has(ip)) {
    requestLogs.set(ip, new LinkedList());
  }

  const log = requestLogs.get(ip)!;

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

export default slidingWindowRateLimiter;