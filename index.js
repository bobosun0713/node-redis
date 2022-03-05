const app = require('express')()
const fetch = require('node-fetch')
const redis = require('redis')

const NODE_PORT = process.env.PORT || 5000
const REDIS_PORT = process.env.PORT || 6379

const client = redis.createClient({
  legacyMode: true, // TODO:保持v4版本前的兼容
  socket: {
    port: REDIS_PORT,
  },
})
client.connect()

// API
async function getResponse(req, res, next) {
  try {
    console.log('Fetching Data.......')
    const { key } = req.params
    const response = await fetch(`http://localhost:4000/mock/api/${key}`)
    const data = await response.json()

    // Set data to Redis
    client.setex(key, 3600, data)
    res.send(setResponse(key, data))
  } catch (err) {
    res.status(500)
  }
}

function setResponse(key, data) {
  return `<h2>Key: ${key} ， Value: ${data} </h2>`
}

// Cache
function cache(req, res, next) {
  const { key } = req.params
  client.get(key, (err, data) => {
    if (err) throw err
    if (data !== null) {
      console.log('Fetching Redis.......')
      res.send(setResponse(key, data))
    } else {
      next()
    }
  })
}

app.get('/repos/:key', cache, getResponse)

app.listen(NODE_PORT, () => {
  console.log(`App listening on port ${NODE_PORT}`)
})
