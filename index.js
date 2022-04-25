const express = require('express')
const server = new express()

server.use('/static', express.static(__dirname+'/static'))

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html')
})

server.listen(8080, () => {
  console.log("Server is running...")
})