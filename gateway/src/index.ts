import * as express from 'express';
import type { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { createProxyMiddleware } from 'http-proxy-middleware'
import slidingWindowRateLimiter from './middleware/ratemiliter';
import redisCache from './middleware/rediscache';
import isAdminJWT from './middleware/isAdminmiddleware';

dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(express.json()); //parse json
app.use(slidingWindowRateLimiter) // ip based rate limiter
app.use(redisCache)

const userProxyMiddleware = createProxyMiddleware<Request, Response>({
    target: 'http://localhost:8001',
    changeOrigin: true,
})

const productsProxyMiddleware = createProxyMiddleware<Request, Response>({
    target: 'http://localhost:8002',
    changeOrigin: true,
})

app.use('/user', userProxyMiddleware) //user service
app.use('/products', isAdminJWT, productsProxyMiddleware) // products service


app.listen(PORT, () => console.log(`API gateway is listening on port: ${PORT}`))
