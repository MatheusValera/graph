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
  let typeGraph = {}
  let matrixAdjacency = []

  console.log('-----------------------------------------------------')
  typeGraph.simpleGraph = false
  if(!verifyEdges(listEdges)){
    matrixAdjacency = buildMatrixAdjacency(listVertices, listEdges)
    console.log(`Matrix Adjacency - ${option} ==> 
    \n`,matrixAdjacency,'\n')
    typeGraph.simpleGraph = verifySimpleGraph(matrixAdjacency)
    typeGraph.multiGraph = false
  }
  else{
    typeGraph.multiGraph = true
  }

  const matrixIncidence = buildMatrixIncidence(listVertices, listEdges, option)
  console.log(`Matrix Incidence - ${option} ==> 
  \n`,matrixIncidence,'\n')

  const list = buildList(listVertices, listEdges, option)
  console.log(`List - ${option} ==> 
  \n`,list,'\n')

  if(matrixAdjacency){
    typeGraph.completed = verifyCompletedGraph(matrixAdjacency)
    typeGraph.regulated = verifyRegulatedGraph(matrixAdjacency)
  }

  console.log(`Classification - ${option} ==> 
  \n`,typeGraph,'\n')

  console.log('-----------------------------------------------------')
  res.json({ status: true, matrixAdjacency, matrixIncidence, list, listEdges, listVertices, typeGraph, option })
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
  
  if(option === 'graph'){
    let listAux = []
    for(elem of listEdges){
      if(!listAux.includes(elem.replace('(','').replace(')','').split("").reverse().join("")))
        listAux.push(elem.replace('(','').replace(')',''))
    }
    listV.forEach((e)=>{matrix.push(buildMatrix(listAux.length))})
    for(elem of listAux){
      matrix[listV.indexOf(elem[0])][listAux.indexOf(elem)] = 1
      matrix[listV.indexOf(elem[2])][listAux.indexOf(elem)] = 1
    }
    return matrix
  }
  
  listV.forEach((e)=>{matrix.push(buildMatrix(listEdges.length))})
  for(elem of listEdges){
    matrix[listV.indexOf(elem[1])][listEdges.indexOf(elem)] = -1
    matrix[listV.indexOf(elem[3])][listEdges.indexOf(elem)] = 1
  }
  
  return matrix
}

buildList = (listV, listEdges, option) => {
  const list = []
  if(option === 'graph'){
    listV.forEach((e)=>{ list.push([])})
    listV.forEach( (value,index) => {

      listEdges.forEach( (edge) => {

        if(edge[1] === value && !list[index].includes(edge[3])) 
          list[index].push(edge[3])
        else if(edge[3] === value && !list[index].includes(edge[1]))
          list[index].push(edge[1])

      })
    })
    return list
  }
  listV.forEach((e)=>{ list.push([e])})
  list.forEach( (value) => {
    listEdges.forEach( (edge) => {
      if(edge[1] === value[0])
        value.push(edge[3])
    })
  })
  return list
}

verifyEdges = (listE) => {
  let flag = false
  listE.forEach((edge) => {
    let regex = new RegExp(edge, 'g')
    let length = listE.toString().match(regex)
    if( length != null && length.length > 1 && edge[1] != edge[3])
      flag = true
  })
  return flag
}

verifySimpleGraph = (matrix) => {
  let simple = true
  let i = 0
  while(simple == true && i < matrix.length){
    if(matrix[i][i] === 0)
      simple = true
    else{
      simple = false
    }
    i++
  }
  return simple
}

verifyCompletedGraph = (matrix) => {
  let flag = true
  i=0
  while(flag && i < matrix.length)
  {
    let line = matrix[i]
    line.forEach( (elem,index) => {
      if(index != i && elem === 0)
        flag = false
    })
    i++
  }
  return flag
}

verifyRegulatedGraph = (matrix) => {
  if(matrix.length) {
    const line = matrix[0].toString()
    const occurrences = line.match(new RegExp('0','g'))
    flag = true
    matrix.forEach((line) => {
      if(occurrences != line.toString().match(new RegExp('0','g')))
        flag = false
    })
    return flag
  }
  return false
}