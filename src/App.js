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

export default function Game() {                                        //Se creo la función juego la cual sustituye a la función board ya que ahora...
  const [history, setHistory] = useState([Array(9).fill(null)]);       //Constante historia la cual cuenta tiene en cuenta los movimientos del array 
  const [currentMove, setCurrentMove] = useState(0);                    //Constante que realiza un seguimiento de que paso esta viendo el usuario
  const xIsNext = currentMove % 2 === 0;                               //currentMove se encarga de determinar el valor de xIsNext
  const currentSquares = history[currentMove];                          //Se muestra el movimiento actual al que se regreso y no muestra los demas

  function handlePlay(nextSquares) {                                   //Se agrega una nueva función llamada handlePlay este llama al board para actualizar el juego
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];    //Esta parte cuando regresas al movimiento anterior, eliminará el resto de la historia...
    setHistory(nextHistory);                                                   //solo dejará hasta el movimiento en que te quedaste
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);                               //Detecta si el siguiente movimiento es par o impar en palabras más sencillas true o false
  }

  const moves = history.map((squares, move) => {          //Se crea la variable moves que es igual a la historia del mapa o el board mediante cuadros y movimientos
    let description;                                     //Luego se define la variable description
    if (move > 0) {                                       //Dice si el movimiento es mayor de 0
      description = 'Go to move #' + move;               //la descripción dice que el movimiento es el numero del movimiento
    } else {
      description = 'Go to game start';                //Sino la descripción dice que el jeugo debe de inciar
    }
    return (
      /*Esto regresa la lista de movimientos que se han hecho; la key se usa para solucionar un error
      Cuando se le da al botón se regresa al moviento hecho en ese momento
      */
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    /* el board llama a las funciones xIsNext,squares y handlePlay hacia la función board
    el moves ingresan los movientos en una lista de puntos en los que los puedes vizualizar como botones*/
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

function calculateWinner(squares) {             //Esta es una función que toma una matriz de 9 como nuestro tablero y busca un ganador...
  const lines = [                              //este puede devolver X, O o Un valor nulo, esto con un ciclo for recorre el largo de las...
    [0, 1, 2],                                //filas si detecta que son tres en raya de algun jugador devuelve un ganador o nulo en caso de empate. 
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
