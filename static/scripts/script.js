const blocks = []
const blockResult = document.getElementById('results')
let listVertices = []
let listEdges = []
let option = 'graph'

console.log(`initial
------------------->
${listVertices || []}
${listEdges || []}`)

getData = async () => {
  listVertices = document.getElementById('vertices').value.split(',')
  listEdges = document.getElementById('edges').value.split(',')
  option = document.querySelector('[name="typeGraph"]:checked').value
  console.log(`Gerado
------------------->
${listVertices}
${listEdges}
${option}`)
let result = {}
  const data = JSON.stringify({listVertices,listEdges,option})
  await fetch('/sendData', { headers: { 'Content-Type': 'application/json'}, method: 'POST', body: data })
  .then( async (response) => {
    result = await response.json()
  })
  addResult(result)
}

addResult = (Result) => {
  blockResult.append(JSON.stringify(Result))
}