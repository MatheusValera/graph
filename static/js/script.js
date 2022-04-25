let listVertices = []
let listEdges = []
let option = 'graph'

console.log(`initial
------------------->
${listVertices || []}
${listEdges || []}`)

getData = () => {
  listVertices = document.getElementById('vertices').value.split(',')
  listEdges = document.getElementById('edges').value.split(',')
  option = document.querySelector('[name="typeGraph"]:checked').value
  console.log(`Gerado
------------------->
${listVertices}
${listEdges}
${option}`)
  const data = JSON.stringify({listVertices,listEdges,option})
  fetch('/sendData', { headers: { 'Content-Type': 'application/json'}, method: 'POST', body: data })
}