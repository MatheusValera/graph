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

addResult = (result) => {
  showAdjacency(result)
  showIncidence(result)
  showList(result)
  showClassification(result)
}

function showAdjacency(result) {
  let table = document.getElementById('t-adjacency')
  table.innerHTML = ''
  
  let tr = document.createElement('tr')
  let th = document.createElement('th')
  th.innerHTML = " "
  tr.appendChild(th)
  listVertices.forEach(element => {
    th = document.createElement('th')
    th.innerHTML = element
    tr.appendChild(th)
  });
  table.append(tr)

  let i = 0;
  result.matrixAdjacency.forEach(element => {
    tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = listVertices[i]
    tr.append(td)
    element.forEach(elem => {
      let td = document.createElement('td')
      td.innerHTML += ' ' + JSON.stringify(elem).replace(/,/g, '')
      tr.append(td)
    });
    table.append(tr)
    i++;
  });
  let div = document.getElementById('div-adjacency')
  if(result.typeGraph.multiGraph)
    div.style.display = 'none';
  else 
    div.style.display = 'flex';
}
  

function showIncidence(result) {
  let table = document.getElementById('t-incidence')
  table.innerHTML = ''
  
  tr = document.createElement('tr')
  th = document.createElement('th')
  th.innerHTML = ' '
  tr.appendChild(th)
  i=0
  if(option == 'graph')
    x = listEdges.length/2
  else 
    x = listEdges.length
  listEdges.forEach(element => {
    if(x>i) {
      th = document.createElement('th')
      th.innerHTML = element
      tr.appendChild(th)
    }
    i++
  });
  table.append(tr)
  i=0
  result.matrixIncidence.forEach(element => {
    tr = document.createElement('tr')
    td = document.createElement('td')
    td.innerHTML = listVertices[i]
    tr.appendChild(td)
    i++
    element.forEach(elem => {
      td = document.createElement('td')
      td.innerHTML = elem
      tr.appendChild(td)
    });
    table.append(tr)
  });
}

function showList(result) {
  let table = document.getElementById('t-list')
  table.innerHTML = ''
  i=0
  result.list.forEach(element => {
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = listVertices[i]
    tr.append(td)
    i++
    element.forEach(elem => {
      let td = document.createElement('td')
      td.innerHTML = elem
      tr.append(td)
    });
    // 
    td = document.createElement('td')
    td.innerHTML = 'null'
    tr.append(td)
    //
    table.append(tr)
  });
}

function showClassification(result) {
  let div = document.getElementById('classification')
  div.innerHTML = ''
  let label = document.createElement('label')
  label.innerHTML = 'SimpleGraph: '
  let p = document.createElement('p')
  p.innerHTML = result.typeGraph.simpleGraph
  div.appendChild(label)
  div.appendChild(p)
  //
  label = document.createElement('label')
  label.innerHTML = 'MultiGraph: '
  p = document.createElement('p')
  p.innerHTML = result.typeGraph.multiGraph
  div.appendChild(label)
  div.appendChild(p)
  //
  label = document.createElement('label')
  label.innerHTML = 'Regulated: '
  p = document.createElement('p')
  p.innerHTML = result.typeGraph.regulated
  div.appendChild(label)
  div.appendChild(p)
  //
  label = document.createElement('label')
  label.innerHTML = 'Completed: '
  p = document.createElement('p')
  p.innerHTML = result.typeGraph.completed
  div.appendChild(label)
  div.appendChild(p)

}