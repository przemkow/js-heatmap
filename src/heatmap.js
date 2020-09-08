/*
  Prototype written in 1hour.
  Refactor code bellow
 */
function renderHeatMap(config) {

const heatMap = Array.from({length: config.y}, (_, y) => Array.from({length: config.x}, (_, x) => ({
  value: 0,
})));


const addToNeighbour = (cellX, cellY, distance = 1) => {
  const rowLimit = heatMap.length - 1;
  const columnLimit = heatMap[0].length - 1;

  for(let x = Math.max(0, cellX - distance); x <= Math.min(cellX + distance, rowLimit); x++) {
    for(let y = Math.max(0, cellY - distance); y <= Math.min(cellY + distance, columnLimit); y++) {
      if(x !== cellX || y !== cellY) {
        heatMap[x][y].value += 2 * (distance - Math.max(Math.abs(y - cellY), Math.abs(x - cellX)));
      }
    }
  }
}

const cellFactory = (x, y) => {
  const div = document.createElement('div');
  div.classList.add('cell');
  let textNode;
  if (config.showValues) {
    textNode = document.createTextNode(heatMap[x][y].value);
    div.appendChild(textNode);
  }
  div.style.backgroundColor = heatMapColorForValue(heatMap[x][y].value);

  heatMap[x][y] = new Proxy(heatMap[x][y], {
    set: function(obj, prop, value) {
      div.style.backgroundColor = heatMapColorForValue(value);
      if (config.showValues) {
        const newTextNode = document.createTextNode(value);
        div.replaceChild(newTextNode, textNode);
        textNode = newTextNode;
      }

      return Reflect.set(...arguments);
    }
  })


  div.addEventListener('mouseenter', () => {
    heatMap[x][y].value += config.hoverIncrease;
    addToNeighbour(x, y, config.hoverRadius);
  })


  div.addEventListener('click', () => {
    heatMap[x][y].value += config.clickIncrease;
    addToNeighbour(x, y, config.clickRadius);
  })
  return div;
}


const rowFactory = () => {
  const div = document.createElement('div');
  div.classList.add('row');
  return div;
}


  const app = document.getElementById('app');
  app.innerHTML="";

  const heatMapNode = document.createElement('div');
  heatMapNode.classList.add('heatmap');

  heatMap.forEach((row, indexX)=> {
    const rowNode = rowFactory()
    row.forEach((_, indexY) => {
      rowNode.appendChild(cellFactory(indexX, indexY))
    })

    heatMapNode.appendChild(rowNode)
  })

  app.appendChild(heatMapNode);
}

function heatMapColorForValue(value)
{
  value = value > 130 ? 130 : value;
  let hue = (1.0 - value/100) * 240

  return `hsl(${hue}, 100%, 50%)`;
}

export {
  renderHeatMap
}
