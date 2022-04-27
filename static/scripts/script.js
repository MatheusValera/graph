const blocks = []
const blockResult = document.getElementById('resultsGraph')
let listVertices = []
let listEdges = []
let option = 'graph'

console.log(`initial
------------------->
${listVertices || []}
${listEdges || []}`)
console.log(`-------------------`)

getData = async () => {

  listVertices = document.getElementById('vertices').value.split(',')
  listEdges = document.getElementById('edges').value.split(',')
  option = document.querySelector('[name="typeGraph"]:checked').value

  console.log(`Gerado
------------------->
${listVertices}
${listEdges}
${option}`)
  if(option === 'graph') {
    let listAux = []
    listEdges.forEach((value) => {
      listAux.push(`(${value.replace('(','').replace(')','').split("").reverse().join("")})`)
    })
    listEdges.push(...listAux)
    console.log(listEdges)
  }
  let result = {}

  const data = JSON.stringify({listVertices,listEdges,option})

  await fetch('/sendData', { headers: { 'Content-Type': 'application/json'}, method: 'POST', body: data })
  .then( async (response) => {
    result = await response.json()
  })

  console.log(result)
  addResult(result)
  console.log(`-------------------`)
}

addResult = (Result) => {
  blockResult.append(JSON.stringify(Result))
}