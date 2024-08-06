import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currMove, setCurrMove] = useState(0);
  const xIsNext = currMove % 2 === 0;
  const currSquare = history[currMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrMove(nextHistory.length - 1);
  }

  function jumpStep(step) {
    setCurrMove(step);
  }

  function handleSort() {
    moves.reverse();
  }

  const moves = history.map((_, step) => {
    let desc;
    if (step > 0) {
      desc = "Go to move #" + step;
    } else {
      desc = "Go to game start";
    }

    return (
      <li key={step}>
        <button onClick={() => jumpStep(step)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} square={currSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSort}>排序</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, square, onPlay }) {
  function handleClick(i) {
    if (square[i] || winner) {
      return;
    }

    const nextSquares = square.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const arr = calcWinner(square);
  const winner = arr[0];
  const line = arr[1];
  let status;
  if (winner) {
    status = `Winner : ${winner}`;
  } else {
    status = "Next Player : " + (xIsNext ? "X" : "O");
  }

  const output = [];
  for (let i = 0; i < 3; i++) {
    const rows = [];
    for (let j = 0; j < 3; j++) {
      const num = 3 * i + j;
      const className = line.includes(num) ? "winner square" : "square";
      rows.push(
        <Square
          className={className}
          key={num}
          value={square[num]}
          onSquareClick={() => handleClick(num)}
        />
      );
    }
    output.push(
      <div key={i} className="board-row">
        {rows}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {output}
    </>
  );
}

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calcWinner(square) {
  const line = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < line.length; i++) {
    const [x, y, z] = line[i];
    if (square[x] && square[x] == square[y] && square[x] == square[z]) {
      return [square[x], line[i]];
    }
  }

  return [null, []];
}
