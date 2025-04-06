import * as express from 'express';
import { connectDB } from "./config/db";
import type { Request, Response } from 'express';
import Redis from 'ioredis';
import * as dotenv from 'dotenv'
import auth from './routes/auth';
dotenv.config()

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
})

const user = express()
const port = process.env.PORT

connectDB();
user.use(express.urlencoded({extended: true}))
user.use('/', auth) // auth routes
user.get('/', async (req: Request, res: Response) => {
    const key = `cache:${req.method}-/user${req.originalUrl}`; // key for redis
    const response = {
        message: "Hello, from the user service"
    }
    await redis.setex(key, 300, JSON.stringify(response)); // cache this response
    await new Promise((resolve) => setTimeout(resolve, 2000)) // imitate a real route logic and latency
    res.json(response)
})

user.post('/create', (req: Request, res: Response) => {
    res.json({
        message: "User created"
    })
})

user.put('/update', (req: Request, res: Response) => {
    res.json({
        message: "User updated"
    })
})

user.delete('/delete', (req: Request, res: Response) => {
    res.json({
        message: "User deleted"
    })
})

user.get('*', (req: Request, res: Response) => {
    res.json({
        message: "404 not found"
    })
})

user.listen(port, () => console.log(`User service is running on port ${port}`))