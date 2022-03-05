const mockApp = require('express')()
const PORT = process.env.PORT || 4000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

mockApp.get('/mock/api/:key', async (req, res, next) => {
  await sleep(2000)
  res.json(Math.floor(Math.random() * 100))
})

mockApp.listen(PORT, () => {
  console.log(`const listening on port ${PORT}`)
})
