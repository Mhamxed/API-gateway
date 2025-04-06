import * as express from 'express'
import type { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import Redis from 'ioredis'
dotenv.config()

const products = express()
const PORT = process.env.PORT || 8002
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
})

products.get('/', async (req: Request, res: Response) => {
    const key = `cache:${req.method}-/products${req.originalUrl}`; // key for redis
    const response = {
        message: "Hello, from the products service"
    }

    await redis.setex(key, 300, JSON.stringify(response)); // cache response for 10 mins
    await new Promise((resolve) => setTimeout(resolve, 1000)) // imitate a real route logic and latency
    res.json(response)
})

products.get('/all', async (req: Request, res: Response) => {
    const key = `cache:${req.method}-/products${req.originalUrl}`; // key for redis
    const response = {
        message: "Products... yay"
    }
    await redis.setex(key, 300, JSON.stringify(response)); // cache response for 10 mins
    await new Promise((resolve) => setTimeout(resolve, 1000)) // imitate a real route logic and latency
    res.json(response)
})

products.get('/:id', async (req: Request, res: Response) => {
    const key = `cache:${req.method}-/products${req.originalUrl}`; // key for redis
    const { id } = req.params
    const hasLetters = /[a-zA-Z]/.test(id);
    if (!hasLetters) {
        const response = {
            message: `You just got served product: ${id}`
        }
        await redis.setex(key, 300, JSON.stringify(response)); // cache response for 10 mins
        await new Promise((resolve) => setTimeout(resolve, 1000)) // imitate a real route logic and latency
        res.json(response)
    } else {
        res.json({
            message: "Invalid product id"
        })
    }
})

products.post('/create', (req: Request, res: Response) => {
    res.json({
        message: "Product was created..."
    })
})

products.put('/update/:id', (req: Request, res: Response) => {
    const { id } = req.params 
    res.json({
        message: `Product= ${id} updated`
    })
})

products.delete('/delete/:id', (req: Request, res: Response) => {
    const { id } = req.params
    res.json({
        message: `Product: ${id} was deleted... yay`
    })
})

products.get("*", (req: Request, res: Response) => {
    res.json({
        message: "404 not found"
    })
})

products.listen(PORT, () => console.log(`products service is listening on port: ${PORT}`))