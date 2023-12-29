const board = document.getElementById('board');
const result = document.getElementById('result');
const cells = document.getElementsByClassName('cell');
let turn = 'X';
let winner = null;

function handleCellClick(e) {
  if (!winner && e.target.textContent === '') {
    e.target.textContent = turn;
    checkWinner();
    turn = turn === 'X' ? 'O' : 'X';
    if (!winner) {
      aiTurn();
    }
  }
}

function endTurn() {
  if (!winner) {
    aiTurn();
  }
}

function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let combo of winningCombos) {
    if (
      cells[combo[0]].textContent === turn &&
      cells[combo[1]].textContent === turn &&
      cells[combo[2]].textContent === turn
    ) {
      winner = turn;
      result.textContent = `Player ${turn} wins!`;
      for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', handleCellClick);
      }
    }
  }
  if (!winner && Array.from(cells).every(cell => cell.textContent !== '')) {
    result.textContent = 'It\'s a draw!';
  }
}

function aiTurn() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = 'O';
      let score = minimax(cells, false);
      cells[i].textContent = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  // cells[move].textContent = 'O';
  // checkWinner();
  // turn = 'X';
  cells[move].textContent = 'O';
  checkWinner();
  turn = 'X';
  endTurn();
}

function minimax(cells, isMaximizing) {
  let winner = checkWinner();
  if (winner !== null) {
    return winner * (isMaximizing ? 1 : -1);
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = 'O';
        let score = minimax(cells, false);
        cells[i].textContent = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = 'X';
        let score = minimax(cells, true);
        cells[i].textContent = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function resetBoard() {
  for (let cell of cells) {
    cell.textContent = '';
    cell.addEventListener('click', handleCellClick);
  }
  winner = null;
  result.textContent = '';
  turn = 'X';
}

