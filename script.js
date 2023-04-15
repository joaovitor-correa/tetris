const gameBoardRows    = 18;
const gameBoardColumns = 16;
const colors = ["purple","red","yellow","green","blue","pink","brown","orange","gray"]
const gameBoard = document.getElementById("gameBoard");
let block_X = Math.floor(gameBoardColumns / 2)
let block_Y = 0
let gameSpeed = 15
let currentBlock = Math.floor(Math.random() * blockTypes.length)
let currentColor = colors[Math.floor(Math.random() * colors.length)]

function drawGameBoard(){
	gameBoard.style.gridTemplateColumns = "repeat("+gameBoardColumns+" , 1fr)"
	for (let x = 0; x < gameBoardRows; x++){
		for (let y = 0; y < gameBoardColumns; y++){
			const boardPixel = document.createElement("div")
			boardPixel.setAttribute("pos-x", y)
			boardPixel.setAttribute("pos-y", x)
			boardPixel.setAttribute("filled", "false")
			gameBoard.appendChild(boardPixel)
		}
	}
}

function drawSinglePixel(posX, posY, color = "red"){
	gameBoard.querySelector('[pos-x="'+posX+'"][pos-y="'+posY+'"]').style.backgroundColor = color;
}

function drawBlock(posX, posY, blockIndex, color){
	for(let rows = 0; rows < blockTypes[blockIndex].length; rows++){
		for(let index = 0; index < blockTypes[blockIndex][rows].length; index++){
			if(blockTypes[blockIndex][rows][index] == 1){
				drawSinglePixel(posX + index, posY + rows, color)
			}
		}
	}
}

function clearGameBoard(){
	for(let i = 0; i < gameBoard.children.length; i++){
		if(gameBoard.children[i].getAttribute("filled") == "false"){
			gameBoard.children[i].style.backgroundColor = "white"
		}
	}
}

function getOffsetBlock(blockIndex){
	let blockOffset = {"left": 0, "top": 0}
	for(let rows = 0; rows < blockTypes[blockIndex].length; rows++){
		for(let index = 0; index < blockTypes[blockIndex][rows].length; index++){
			if(blockTypes[blockIndex][rows][index] == 1){
				blockOffset.left = index
				blockOffset.top = rows
			}
		}
	}
	return blockOffset
}

document.addEventListener('keydown', (event) => {
	switch(event.code){
		case "ArrowRight":
			if(((block_X + getOffsetBlock(currentBlock).left + 1) > (gameBoardColumns - 1))){
				return
			}
			if(!checkHorizontalColisionBlocks(block_X, block_Y, currentBlock, event.code)){
				block_X = block_X + 1
			}
			clearGameBoard()
			drawBlock(block_X,block_Y,currentBlock,currentColor)
			break;
		case "ArrowLeft":
			if(((block_X + getOffsetBlock(currentBlock).left - 1) < 0)){
				return
			}
			if(!checkHorizontalColisionBlocks(block_X, block_Y, currentBlock, event.code)){
				block_X = block_X - 1
			}
			clearGameBoard()
			drawBlock(block_X,block_Y,currentBlock,currentColor)
			break;
		case "ArrowDown":
			if(((block_Y + getOffsetBlock(currentBlock).top + 1) > (gameBoardRows - 1)) || checkVerticalColisionBlocks(block_X, block_Y, currentBlock)){
				freezeBlock(block_X, block_Y, currentBlock)
				block_X = Math.floor(gameBoardColumns / 2)
				block_Y = 0
				currentBlock = [Math.floor(Math.random() * blockTypes.length)]
				currentColor = colors[Math.floor(Math.random() * colors.length)]
				return
			}
			block_Y = block_Y + 1
			clearGameBoard()
			drawBlock(block_X,block_Y,currentBlock,currentColor)
			break;
		case "Space":
			console.log(currentBlock)
			blockTypes[currentBlock] = rotateBlock(blockTypes[currentBlock])
			clearGameBoard()
			drawBlock(block_X,block_Y,currentBlock,currentColor)
			break;
	}
}, false);

function rotateBlock(block) {
  const rotatedBlock = [];
  const size = block.length;
  for (let i = 0; i < size; i++) {
    rotatedBlock.push([]);
    for (let j = 0; j < size; j++) {
      rotatedBlock[i][j] = block[size - 1 - j][i];
    }
  }
  return rotatedBlock;
}


function freezeBlock(posX, posY, blockIndex){
	for(let rows = 0; rows < blockTypes[blockIndex].length; rows++){
		for(let index = 0; index < blockTypes[blockIndex][rows].length; index++){
			if(blockTypes[blockIndex][rows][index] == 1){
				gameBoard.querySelector('[pos-x="'+(posX + index)+'"][pos-y="'+(posY + rows)+'"]').setAttribute("filled", "true")
			}
		}
	}	
}

function checkVerticalColisionBlocks(posX, posY, blockIndex){
	for(let rows = (blockTypes[blockIndex].length - 1); rows >= 0; rows--){
		for(let index = 0; index < blockTypes[blockIndex][rows].length; index++){
			if(blockTypes[blockIndex][rows][index] == 1 && gameBoard.querySelector('[pos-x="'+(posX + index)+'"][pos-y="'+(posY + rows + 1)+'"]').getAttribute("filled") == "true"){
				console.log(posX + index, posY + rows)
				console.log(gameBoard.querySelector('[pos-x="'+(posX + index)+'"][pos-y="'+(posY + rows)+'"]'))
				return true
			}
		}
	}
}

function checkHorizontalColisionBlocks(posX, posY, blockIndex, blockDirection){
	for(let j = posY; j <= (posY + getOffsetBlock(blockIndex).top); j++){
		for(let i = posX; i <= (posX + getOffsetBlock(blockIndex).left); i++){
			if(blockDirection == "ArrowLeft" && gameBoard.querySelector('[pos-x="'+(i - 1)+'"][pos-y="'+(j)+'"]').getAttribute("filled") == "true"){
				return true
			}else if(blockDirection == "ArrowRight" && gameBoard.querySelector('[pos-x="'+(i + 1)+'"][pos-y="'+(j)+'"]').getAttribute("filled") == "true"){
				return true
			}
		}
	}
}

drawGameBoard()

var intervalId = window.setInterval(function(){
	if(((block_Y + getOffsetBlock(currentBlock).top + 1) > (gameBoardRows - 1)) || checkVerticalColisionBlocks(block_X, block_Y, currentBlock)){
		freezeBlock(block_X, block_Y, currentBlock)
		block_X = Math.floor(gameBoardColumns / 2)
		block_Y = 0
		currentBlock = [Math.floor(Math.random() * blockTypes.length)]
		currentColor = colors[Math.floor(Math.random() * colors.length)]
		return
	}
	block_Y = block_Y + 1
	clearGameBoard()
	drawBlock(block_X,block_Y,currentBlock,currentColor)
}, (10000 / gameSpeed));
