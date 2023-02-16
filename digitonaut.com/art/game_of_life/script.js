function createDrawingContext({ width, height, parentEl }) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  parentEl.appendChild(canvas);
  return canvas.getContext('2d');
}

function createRandomGrid({ sizeX, sizeY, cellTypes }) {
  return new Array(sizeY).join(' ').split(' ').map((_) =>
  new Array(sizeX).join(' ').split(' ').map((_) =>
  cellTypes[Math.floor(Math.random() * cellTypes.length)]));


}

function createProbabilityList(list, probabilityField) {
  return list.reduce((acc, item) =>
  acc.concat(
  new Array(item[probabilityField]).
  join(' ').
  split(' ').
  map(e => item)),

  []);
}

function findNearestNeighbours(grid, x, y) {
  var prevRow = grid[y - 1] || [];
  var currentRow = grid[y];
  var nextRow = grid[y + 1] || [];
  return [
  prevRow[x - 1], prevRow[x], prevRow[x + 1],
  currentRow[x - 1], currentRow[x + 1],
  nextRow[x - 1], nextRow[x], nextRow[x + 1]].
  filter(e => e);
}

class Thing {
  constructor({ name, color, initialProbability, rule }) {
    this.name = name;
    this.color = color;
    this.initialProbability = initialProbability;
    this.rule = rule;
  }}


var Settings = {
  width: window.innerWidth,
  height: window.innerHeight,

  cell(type) {
    return this.cellTypes.find(cell => cell.name == type);
  },

  cellSize: 6,

  cellTypes: [
  new Thing({
    name: 'HUMAN',
    color: '#fa8',
    initialProbability: 15,
    rule(grid, x, y) {
      var neighbours = findNearestNeighbours(grid, x, y);

      var humanNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'HUMAN').
      length;

      var waterNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'WATER').
      length;

      if (humanNeighbourCount < 2 || humanNeighbourCount > 3) {
        return Settings.cell('GROUND');
      }
      if (waterNeighbourCount > 3) {
        return Settings.cell('WATER');
      }
      return this;
    } }),


  new Thing({
    name: 'TREE',
    color: 'forestgreen',
    initialProbability: 1,
    rule(grid, x, y) {
      var neighbours = findNearestNeighbours(grid, x, y);

      var treeNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'TREE').
      length;

      var waterNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'WATER').
      length;

      var humanNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'HUMAN').
      length;

      var groundNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'GROUND').
      length;

      if (!treeNeighbourCount || humanNeighbourCount) {
        return Settings.cell('GROUND');
      }

      if (groundNeighbourCount < 1 && waterNeighbourCount > 2) {
        return Settings.cell('WATER');
      }

      return this;
    } }),


  new Thing({
    name: 'WATER',
    color: 'blue',
    initialProbability: 10,
    rule(grid, x, y) {
      var neighbours = findNearestNeighbours(grid, x, y);
      var waters = neighbours.filter(cell => cell.name == 'WATER').length;
      var people = neighbours.filter(cell => cell.name == 'HUMAN').length;
      if (!waters || people) {
        return Settings.cell('GROUND');
      }
      return this;
    } }),


  new Thing({
    name: 'GROUND',
    color: '#534f20',
    initialProbability: 65,
    rule(grid, x, y) {
      var neighbours = findNearestNeighbours(grid, x, y);

      var waterNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'WATER').
      length;

      var treeNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'TREE').
      length;

      var humanNeighbourCount = neighbours.filter((cell) =>
      cell.name == 'HUMAN');


      if (waterNeighbourCount) {
        return Settings.cell('TREE');
      }

      if (waterNeighbourCount > 2) {
        return Settings.cell('WATER');
      }

      if (treeNeighbourCount > 4) {
        return Settings.cell('TREE');
      }

      if (humanNeighbourCount.length == 3) {
        return Settings.cell('HUMAN');
      }

      return this;
    } })] };




var ctx = createDrawingContext({
  width: Settings.width,
  height: Settings.height,
  parentEl: document.body });


var grid = createRandomGrid({
  sizeX: Math.floor(Settings.width / Settings.cellSize),
  sizeY: Math.floor(Settings.height / Settings.cellSize),
  cellTypes: createProbabilityList(Settings.cellTypes, 'initialProbability') });


function render(grid, ctx) {
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      ctx.fillStyle = cell.color;
      ctx.fillRect(
      cellIndex * Settings.cellSize,
      rowIndex * Settings.cellSize,
      Settings.cellSize,
      Settings.cellSize);

    });
  });
}

function mutate(grid) {
  return grid.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      return cell.rule(grid, cellIndex, rowIndex);
    });
  });
}

function treshold(value) {
  var i = 0;
  return _ => !(i++ % value);
}

var shouldUpdate = treshold(window.innerWidth > 1000 ? 1 : 3);

(function loop() {
  render(grid = shouldUpdate() ? mutate(grid) : grid, ctx);
  requestAnimationFrame(loop);
})();