import { Graph, astar } from "./astar";
import { gridIn } from "./grids/grid_100x100.json";

// var gridIn = [
//     [1, 1, 1, 1, 1],
//     [0, 1, 1, 1, 0],
//     [0, 1, 1, 1, 0],
//     [0, 1, 1, 1, 0],
//     [0, 1, 1, 1, 0],
//     [0, 0, 1, 0, 1]
// ]

var graph = new Graph(gridIn)
var boardDivHorizontalLeng = gridIn[0].length
var boardDivVerticalLeng = gridIn.length

var boardDivElement = document.getElementById('board_element')
boardDivElement.style.gridTemplateRows = `repeat(${boardDivVerticalLeng}, 1fr)`
boardDivElement.style.gridTemplateColumns = `repeat(${boardDivHorizontalLeng}, 1fr)`

var startCellDivElement
var endCellDivElement


const drawBoard = () => {
    boardDivElement.innerHTML = '';

    for (let x = 0; x < boardDivVerticalLeng; x++) {
        const row = gridIn[x];
        for (let y = 0; y < row.length; y++) {
            let isNotBlocked = row[y] > 0
            const cell = document.createElement('div')
            cell.style.gridRowStart = x + 1
            cell.style.gridColumnStart = y + 1

            let cellType = 'blocked-cell'
            if (isNotBlocked) {
                cellType = 'empty-cell'
                cell.addEventListener('click', cellClickHandler)
            }

            cell.classList.add('cell', cellType)
            boardDivElement.appendChild(cell)
        }
    }
}


const cellClearSelectionHandler = (e) => {
    if (e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) {
        clearResultHandler()
    }
}

const clearResultHandler = (e) => {
    startCellDivElement = null
    endCellDivElement = null
    let cells = boardDivElement.children
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.classList.remove('start-cell', 'end-cell', 'visited-cell', 'closed-cell', 'path-cell')
    }
}


const cellClickHandler = (event) => {
    if (startCellDivElement && endCellDivElement)
        return

    let cell = event.target
    console.log(`Row: ${cell.style.gridRowStart - 1}, Column: ${cell.style.gridColumnStart - 1}`)

    if (!startCellDivElement) {
        startCellDivElement = cell
        startCellDivElement.classList.add('start-cell')

    } else {
        endCellDivElement = cell
        endCellDivElement.classList.add('end-cell')

        var startNdx = { x: startCellDivElement.style.gridRowStart - 1, y: startCellDivElement.style.gridColumnStart - 1 }
        var endNdx = { x: endCellDivElement.style.gridRowStart - 1, y: endCellDivElement.style.gridColumnStart - 1 }

        let res = findPath(startNdx, endNdx)
        console.log(`Found shortes path with length of ${res.length} cells.`)
        console.log(res)

        drawResult(res)
    }
}

const findPath = (startNdx, endNdx) => {
    var start = graph.grid[startNdx.x][startNdx.y]
    var end = graph.grid[endNdx.x][endNdx.y]
    return astar.search(graph, start, end)
}

const drawResult = (result) => {
    // let flattedGraph = graph.grid.flat().filter(gridNode => gridNode.visited)
    let flattenedGrid = graph.grid.reduce((acc, row) => acc.concat(row.filter(gridNode => gridNode.visited)), [])

    flattenedGrid.forEach(gridNode => {
        let ndx = (gridNode.x * boardDivHorizontalLeng) + gridNode.y
        // console.log("boardDivHorizontalLeng")
        // console.log(boardDivHorizontalLeng)
        boardDivElement.children[ndx].classList.add('visited-cell')
        if (gridNode.closed)
            boardDivElement.children[ndx].classList.add('closed-cell')
    })

    result.forEach(gridNode => {
        let ndx = (gridNode.x * boardDivHorizontalLeng) + gridNode.y
        boardDivElement.children[ndx].classList.add('path-cell')
    })
}



var resetButton = document.getElementById('reset')
resetButton.addEventListener('click', clearResultHandler);

document.addEventListener('keydown', cellClearSelectionHandler);


drawBoard()

