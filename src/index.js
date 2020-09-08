import { renderHeatMap } from "./heatmap";


renderHeatMap({
  x: 50,
  y: 30,
  hoverIncrease: 3,
  hoverRadius: 3,
  clickIncrease: 10,
  clickRadius: 10,
  showValues: false,
})


document.getElementById('updateConfig').addEventListener("submit", (e) => {
  e.preventDefault();
  const config = {
    x: parseInt(document.getElementById('size-x').value),
    y: parseInt(document.getElementById('size-y').value),
    hoverIncrease: parseInt(document.getElementById('hover-increase').value),
    hoverRadius: parseInt(document.getElementById('hover-radius').value),
    clickIncrease: parseInt(document.getElementById('click-increase').value),
    clickRadius: parseInt(document.getElementById('click-radius').value),
    showValues: document.getElementById('show-values').checked
  }

  renderHeatMap(config)
})


let dynamicStyles = document.createElement('style');
document.body.appendChild(dynamicStyles);

document.getElementById('square-size').addEventListener('input', (e) => {
  const size = e.target.value;
  const newDynamicStyles = document.createElement('style');
  newDynamicStyles.innerHTML = `.cell {width: ${size}px; height: ${size}px; line-height: ${size}px; font-size: ${size/1.2}px`;
  document.body.replaceChild(newDynamicStyles, dynamicStyles);
  dynamicStyles = newDynamicStyles;
})
