import { useState } from "react";
import './App.css';
import Box from './component/Box';
import ImageButton from './component/ImageButton';

const choice = {
  rock: {
    name: "Rock",
    img: "/images/rock.png",
  },
  scissors: {
    name: "Scissors",
    img: "/images/scissors.png",
  },
  paper: {
    name: "Paper",
    img: "/images/paper.png",
  },
};

function App() {
  const [userSelect, setUserSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [result, setResult] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [userWins, setUserWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [ties, setTies] = useState(0);

  const play = (userChoice) => {
    setUserSelect(choice[userChoice]);
    let computerChoice = randomChoice();
    setComputerSelect(computerChoice);
    let gameResult = judgement(choice[userChoice], computerChoice);
    setResult(gameResult);
    setGameCount(prevCount => prevCount + 1);
    if (gameResult === "WIN") {
      setUserWins(prevWins => prevWins + 1);
    } else if (gameResult === "LOSE") {
      setComputerWins(prevWins => prevWins + 1);
    } else if (gameResult === "TIE") {
      setTies(prevTies => prevTies + 1);
    }
  };

  const randomChoice = () => {
    let itemArray = Object.keys(choice);
    let randomItem = Math.floor(Math.random() * itemArray.length);
    let final = itemArray[randomItem];
    return choice[final];
  };

  const judgement = (user, computer) => {
    if (user.name === computer.name) {
      return "TIE";
    } else if (user.name === "Rock") return computer.name === "Scissors" ? "WIN" : "LOSE";
    else if (user.name === "Scissors") return computer.name === "Paper" ? "WIN" : "LOSE";
    else if (user.name === "Paper") return computer.name === "Rock" ? "WIN" : "LOSE";
  };

  const resetGame = () => {
    setUserSelect(null);
    setComputerSelect(null);
    setResult("");
    setGameCount(0);
    setUserWins(0);
    setComputerWins(0);
    setTies(0);
  };

  return (
    <div className='container'>
      <div className="row d-flex flex-column mb-3 item-box">
        <div className="d-flex justify-content-center">
          <div className='col-12 title-img'>
            <img src={process.env.PUBLIC_URL + '/images/title_banner.png'} alt="Title Banner" />
          </div>
        </div>

        <div className="d-flex justify-content-around p-2">
          <div className="item-box-r1">Total Games : {gameCount}</div>
          <div className="item-box-r1">You : {userWins}</div>
          <div className="item-box-r1">Ties : {ties}</div>
          <div className="item-box-r1">Computer : {computerWins}</div>
          <div className="item-box-reset"> <button className="resetButton" onClick={resetGame}>Reset</button></div>
        </div>

        <div className="col-12 d-flex justify-content-center">
          <div className='row'>
            <Box title="You" item={userSelect} result={result}/>
            <Box title="Computer" item={computerSelect} result={result === "LOSE" ? "WIN" : result === "WIN" ? "LOSE" : result}/>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4 mb-4">          
          <ImageButton
            defaultImage={process.env.PUBLIC_URL + '/images/button-scissors.png'}
            hoverImage={process.env.PUBLIC_URL + '/images/button-scissors-hover.png'}
            onClick={() => play('scissors')}
          />
          <ImageButton
            defaultImage={process.env.PUBLIC_URL + '/images/button-rock.png'}
            hoverImage={process.env.PUBLIC_URL + '/images/button-rock-hover.png'}
            onClick={() => play('rock')}
          />
          <ImageButton
            defaultImage={process.env.PUBLIC_URL + '/images/button-paper.png'}
            hoverImage={process.env.PUBLIC_URL + '/images/button-paper-hover.png'}
            onClick={() => play('paper')}
          />
        </div>

      </div>
    </div>
  );
}

export default App;