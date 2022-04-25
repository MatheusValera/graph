const express = require('express')
const bp = require('body-parser')
const server = new express()

server.use(bp.json())
server.use('/static', express.static(__dirname+'/static'))

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html')
})

server.post('/sendData', (req, res) => {
  const listVertices = req.body.listVertices
  const listEdges = req.body.listEdges
  const option = req.body.option
  console.log(`Solve ${option} ==> `,listVertices, listEdges)
  if(option == 'graph'){
  }
  res.json({ status: true })
})

server.listen(8080, () => {
  console.log("Server is running...")
})