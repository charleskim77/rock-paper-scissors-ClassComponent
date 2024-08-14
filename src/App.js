import React, { useState, useEffect } from "react";
import './App.css';
import Box from './component/Box';
import ImageButton from './component/ImageButton';
import NameInputPopup from './component/NameInputPopup';
import RankingList from './component/RankingList';
import StartPage from './component/StartPage';
import axios from 'axios';

const choice = {
  rock: {
    name: "Rock",
    img: process.env.PUBLIC_URL + "/images/rock.png",

  },
  scissors: {
    name: "Scissors",
    img: process.env.PUBLIC_URL + "/images/scissors.png",
  },
  paper: {
    name: "Paper",
    img: process.env.PUBLIC_URL + "/images/paper.png",
  },
};

const MAX_GAMES = 150;

function App() {
  const [userSelect, setUserSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [result, setResult] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [userWins, setUserWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [points, setPoints] = useState(1000);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [rankings, setRankings] = useState([]);
  const [gameMode, setGameMode] = useState("start"); // "start", "guest", "challenge"

  const [buttonSound] = useState(new Audio(process.env.PUBLIC_URL + "/audio/button.mp3"));
  const [winSound] = useState(new Audio(process.env.PUBLIC_URL + "/audio/win.mp3"));
  const [loseSound] = useState(new Audio(process.env.PUBLIC_URL + "/audio/lose.mp3"));
  const [tieSound] = useState(new Audio(process.env.PUBLIC_URL + "/audio/tie.mp3"));

  useEffect(() => {
    const sounds = [buttonSound, winSound, loseSound, tieSound];
    sounds.forEach(sound => {
      sound.load();
      sound.onerror = () => {
        console.error(`Error loading sound: ${sound.src}`);
      };
    });
    fetchRankings();
  }, [buttonSound, winSound, loseSound, tieSound]);

  const saveGameRecord = async () => {
    if (gameMode === "challenge") {
      try {
        await axios.post('/api/api.php', {
          action: 'saveRecord',
          userName,
          finalPoints: points,
          gameRecord: { wins: userWins, losses: computerWins, ties },
          time: new Date().toISOString(),
        });
        fetchRankings();
      } catch (error) {
        console.error("Error saving game record:", error);
      }
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await axios.get('/api/api.php', {
        params: { action: 'getRankings' }
      });
      setRankings(response.data);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    }
  };

  const playSound = (sound) => {
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

  const updatePoints = (change) => {
    setPoints(prevPoints => {
      const newPoints = prevPoints + change;
      if (newPoints <= 0) {
        setIsGameOver(true);
        return 0;
      }
      return newPoints;
    });
  };

  const play = (userChoice) => {
    if (isGameOver || gameCount >= MAX_GAMES) return;

    playSound(buttonSound);
    setUserSelect(choice[userChoice]);
    let computerChoice = randomChoice();
    setComputerSelect(computerChoice);
    let gameResult = judgement(choice[userChoice], computerChoice);
    setResult(gameResult);
    setGameCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount >= MAX_GAMES) {
        setIsGameOver(true);
      }
      return newCount;
    });
    if (gameResult === "WIN") {
      setUserWins(prevWins => prevWins + 1);
      updatePoints(150);
      playSound(winSound);
    } else if (gameResult === "LOSE") {
      setComputerWins(prevWins => prevWins + 1);
      updatePoints(-150);
      playSound(loseSound);
    } else if (gameResult === "TIE") {
      setTies(prevTies => prevTies + 1);
      updatePoints(-30);
      playSound(tieSound);
    }

    if (gameCount + 1 >= MAX_GAMES || points <= 0) {
      setIsGameOver(true);
      saveGameRecord();
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

  const handleNameSubmit = (name) => {
    setUserName(name);
    setShowNamePopup(false);
    setGameMode("challenge");
  };

  const resetGame = () => {
    playSound(buttonSound);
    setUserSelect(null);
    setComputerSelect(null);
    setResult("");
    setGameCount(0);
    setUserWins(0);
    setComputerWins(0);
    setTies(0);
    setPoints(1000);
    setIsGameOver(false);
    setGameMode("start");
    fetchRankings();
  };

  const startGuestMode = () => {
    setGameMode("guest");
  };

  const startChallengeMode = () => {
    setShowNamePopup(true);
  };

  if (gameMode === "start") {
    return <StartPage onStartGuest={startGuestMode} onStartChallenge={startChallengeMode} />;
  }

  return (
    <div className='container'>
      {showNamePopup && <NameInputPopup onSubmit={handleNameSubmit} />}
      <div className="row d-flex flex-column mb-3 item-box">
        <div className="d-flex justify-content-center">
          <div className='col-12 title-img'>
            <img src={process.env.PUBLIC_URL + '/images/title_banner.png'} alt="Title Banner" />
          </div>
        </div>

        <div className="d-flex justify-content-around p-2">
          <div className="item-box-r1">Total Games : {gameCount} / {MAX_GAMES}</div>
          <div className="item-box-r1">You : {userWins}</div>
          <div className="item-box-r1">Ties : {ties}</div>
          <div className="item-box-r1">Computer : {computerWins}</div>
          <div className="item-box-r1">Points : {points}</div>
          <div className="item-box-reset"> <button className="resetButton" onClick={resetGame}>Reset</button></div>
        </div>

        <div className="alert alert-info text-center" role="alert">
          이길 경우 150 포인트 획득 / 패배 시 150 포인트 차감 / 비길 경우 30 포인트 차감됩니다.
          {isGameOver && points <= 0 && (
            <p className="mt-2 text-danger font-weight-bold">
              포인트를 모두 잃었습니다. 더 이상 진행이 불가합니다.
            </p>
          )}
          {isGameOver && gameCount >= MAX_GAMES && (
            <p className="mt-2 text-danger font-weight-bold">
              도전 가능한 최종 게임 횟수에 도달했습니다.
            </p>
          )}
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
            disabled={isGameOver}
          />
          <ImageButton
            defaultImage={process.env.PUBLIC_URL + '/images/button-rock.png'}
            hoverImage={process.env.PUBLIC_URL + '/images/button-rock-hover.png'}
            onClick={() => play('rock')}
            disabled={isGameOver}
          />
          <ImageButton
            defaultImage={process.env.PUBLIC_URL + '/images/button-paper.png'}
            hoverImage={process.env.PUBLIC_URL + '/images/button-paper-hover.png'}
            onClick={() => play('paper')}
            disabled={isGameOver}
          />
        </div>
      </div>
      {gameMode === "challenge" && <RankingList rankings={rankings} />}
    </div>
  );
}

export default App;