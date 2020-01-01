import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import p2 from './p2.mp3'
import p3 from './p3.mp3'

function Square(props) {
    return (
      <button className="square" 
      onClick={props.onClick}>
        {props.value}
      </button>
    );
}

function AlertIt(props){
  return(<div>
         Winner is: {props.winner}
       </div>)
 }

class Board extends React.Component {


  renderSquare(i) {
    return (<Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />);
  }


  render() {
    return (
      <div className='my-board'>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext:true
    }
  }
  onClickHandle(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      history:history.concat([{squares: squares}]),
      stepNumber: history.length,
       xIsNext: !this.state.xIsNext});
       let audio1 = new Audio(p2)
       audio1.play();
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  startItAgain(){
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext:true
    })
    let audio2 = new Audio(p3)
    audio2.play();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className='btn5' onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      )
    })

    let status;
    if (winner) {
         status = <AlertIt winner={winner}/>
        //  console.log(this.state.history[this.state.history.length-1].squares)
    }

    else if(this.state.history[this.state.history.length-1].squares.filter(e => e?e:'').length === 9){
      status = 'Draw';
    }
    
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <React.Fragment>
        <div className='full'>
        <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.onClickHandle(i)} 
          />
        </div>
        <div className='game-info'>
          <div className={`my-status ${winner?'win':''}`}>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
      <button className='btn10' onClick={()=> this.startItAgain()}>Start Again</button>
      </div>
      </React.Fragment>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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
