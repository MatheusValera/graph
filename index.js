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

  const matrixAdjacency = buildMatrixAdjacency(listVertices, listEdges)
  console.log(`Matrix Adjacency ${option} ==> 
  `,matrixAdjacency)

  const matrixIncidence = buildMatrixIncidence(listVertices, listEdges, option)
  console.log(`Matrix Incidence ${option} ==> 
  `,matrixIncidence)

  const list = buildList(listVertices, listEdges, option)
  console.log(`List ${option} ==> 
  `,list)

  res.json({ status: true, matrixAdjacency, matrixIncidence, list })
})

server.listen(8080, () => {
  console.log("Server is running...")
})

buildMatrix = (length) => {
  i = 0
  let listAux = []
  while(i < length){
    listAux.push(0)
    i++
  }
  return listAux
}

buildMatrixAdjacency = (listV, listEdges) => {
  let matrix = []
  listV.forEach((e)=>{matrix.push(buildMatrix(listV.length))})
  for(elem of listEdges){
    matrix[listV.indexOf(elem[1])][listV.indexOf(elem[3])] = 1
  }
  return matrix
}

buildMatrixIncidence = (listV, listEdges, option) => {
  let matrix = []
  listV.forEach((e)=>{matrix.push(buildMatrix(listV.length))})

  if(option === 'graph'){
    let listAux = []
    for(elem of listEdges){
      if(!listAux.includes(elem.replace('(','').replace(')','').split("").reverse().join("")))
        listAux.push(elem.replace('(','').replace(')',''))
    }
    for(elem of listAux){
      matrix[listV.indexOf(elem[0])][listAux.indexOf(elem)] = 1
      matrix[listV.indexOf(elem[2])][listAux.indexOf(elem)] = 1
    }
    return matrix
  }

  for(elem of listEdges){
    matrix[listV.indexOf(elem[1])][listEdges.indexOf(elem)] = -1
    matrix[listV.indexOf(elem[3])][listEdges.indexOf(elem)] = 1
  }
  
  return matrix
}

buildList = (listV, listEdges, option) => {
  const list = []
  listV.forEach((e)=>{ list.push([e])})
  if(option === 'graph'){
    list.forEach( (value) => {
      listEdges.forEach( (edge) => {
        if(edge[1] === value[0] && !value.includes(edge[3]))
          value.push(edge[3])
        else if(edge[3] === value[0] && !value.includes(edge[3]))
          value.push(edge[1])
      })
    })
    return list
  }
  list.forEach( (value) => {
    listEdges.forEach( (edge) => {
      if(edge[1] === value[0])
        value.push(edge[3])
    })
  })
  return list
}

// (a.b),(b.a),(b.d),(d.b),(d.c),(c.d),(c.a),(a.c)