import { useState } from 'react';                        //Función propia de react que permite "recordar" en este caso los click

function Square({ value, onSquareClick }) {              //Esta es la función para detectar cuando se toca un cuadrado
  return (                                               //La función OnSquareClick va a pasar hacia la función board para detectar cuando se ha hecho un click
    <button className="square" onClick={onSquareClick}> 
      {value}
    </button>                                             //Para no pintar la palabra explicita valor se le ponen las llaves y lo deja vacio
  );                                                      //Esto para se usa en JSX para especificar que es un prop
}

function Board({ xIsNext, squares, onPlay }) {        //xIsNext es una función booleana que por defecto es verdadero, pero cuando cuando se usa la función...
  function handleClick(i) {                         //handleClick este cambia de valor para dar paso al otro jugador en este caso la O, la i que tiene la función...
                                                    //en este caso en board se llama a la función cuadrados y onPlay
    if (calculateWinner(squares) || squares[i]) {   //Esta es una función que detecta 2 cosas si un jugador a ganado o si un jugador ha hecho click
      return;
    }
    const nextSquares = squares.slice();         //Crea una copia de la matriz de cuadrados y este puede agregar las x cuando la función handleClick es usada.
    if (xIsNext) {                             //Este es un ciclo el cual dice que X es el siguiente pinte X sino este pinte O...
      nextSquares[i] = 'X';                    //esto ya que xIsNext es booleano true por default cuando se activa el handleClick y cambia si...
    } else {                                    //este ha sido presionado cambia a False y pinte las O.
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);                        //Esta función hace que el Board se pueda actualizar cuando se hace click, simplemente para reiniciar el juego
  }

  const winner = calculateWinner(squares);      //Se define la variable ganador o el siguiente jugador esta es igual a la función para detectar ganador
  let status;                                  //Se defina la varible status para saber el status de ganador
  if (winner) {                                //Luego tenemos un if el cual dice si que si el status del juego es ganador pone el jugador que gano 
    status = 'Winner: ' + winner;             //Sino solo se pone el siguiente jugador en este caso puede ser X o O recordando que la función XIsNext es booleano
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');   //Todo esto se pone en la variable de status
  }

  return (   
    /*Se agrega encima del board el status que es un label que cambian con la función handleClick con el if de ganador o el turno del jugador.
    
    Para los cuadrados se usa la función OnSquareClick que sabe cuando es presionado pero se le agrega 
    una función de flecha la que ayuda que no exista un conflicto este conflicto es por la función handleClick que es la que pinta las "X" 
    en este caso solo se ejecutará la función handleClick cuando está se tocada como ejemplo: se presiona el square 3 solo se ejecutará 
    la función en este cuadrado.
    */
    <>
      <div className="status">{status}</div>              
      <div className="board-row"> 
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
