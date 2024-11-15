import { useState } from 'react';
import Player from './components/Player';
import GameBoard from './components/GameBoard';
import Log from './components/Log';
import GameOver from './components/GameOver';
import { WINNING_COMBINATIONS } from './Winning-combinations';

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(playerTurn) {

  let currentPlayer = 'X';

  if(playerTurn.length > 0 && playerTurn[0].player === 'X') {
    currentPlayer = 'O'
  }

  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for(const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function deriveGameBoard(playerTurn) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for(const turn of playerTurn) {
      const {square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col] = player;
  }

  return gameBoard;
}

function App() {

  const [playerTurn, setPlayerTurn] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  const activePlayer = deriveActivePlayer(playerTurn);

  const gameBoard = deriveGameBoard(playerTurn);

  const winner = deriveWinner(gameBoard, players);

  const hasDraw = playerTurn.length === 9 && !winner;

  function handleSelectedSquare(rowIndex, colIndex) {

    setPlayerTurn(prevTurn => {

      const currentPlayer = deriveActivePlayer(prevTurn);

      const updateTurns = [{square: {row: rowIndex, col: colIndex}, player: currentPlayer}, 
        ...prevTurn];

        return updateTurns
    });
  }

  function handleRestart() {
    setPlayerTurn([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className='highlight-player'>
          <Player 
          initialName={PLAYERS.X}
          symbol="X" 
          isActive={activePlayer === 'X'}
          onChangeName={handlePlayerNameChange}/>
          <Player 
          initialName={PLAYERS.O}
          symbol="O"
          isActive={activePlayer === 'O'}
          onChangeName={handlePlayerNameChange}/>
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectedSquare} board={gameBoard}/>
      </div>
      <Log turns={playerTurn}/>
    </main>
  );
}

export default App;
