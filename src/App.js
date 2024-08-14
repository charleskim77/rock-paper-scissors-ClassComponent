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

const MAX_GAMES = 50;

function App() {
  const [userSelect, setUserSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [result, setResult] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [userWins, setUserWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [points, setPoints] = useState(1500);
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState("");
  const [rankings, setRankings] = useState([]);
  const [gameMode, setGameMode] = useState("start"); // "start", "guest", "challenge"
  const [showNamePopup, setShowNamePopup] = useState(false);

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
  }, [buttonSound, winSound, loseSound, tieSound]);

  useEffect(() => {
    if (gameMode === "challenge") {
      fetchRankings();
    }
  }, [gameMode]);

  
  const fetchRankings = async () => {
    try {
      const response = await axios.get('https://graze99.com/api/api.php?action=getRankings');
      if (Array.isArray(response.data)) {
        setRankings(response.data);
      } else {
        console.error("Fetched rankings is not an array:", response.data);
        setRankings([]);  
      }
    } catch (error) {
      console.error("Error fetching rankings:", error);
      setRankings([]);  
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
    const computerChoice = randomChoice();
    setComputerSelect(computerChoice);
    const gameResult = judgement(choice[userChoice], computerChoice);
    setResult(gameResult);

    let newPoints = points;
    let newUserWins = userWins;
    let newComputerWins = computerWins;
    let newTies = ties;

    if (gameResult === "WIN") {
      newUserWins++;
      newPoints += 150;
      playSound(winSound);
    } else if (gameResult === "LOSE") {
      newComputerWins++;
      newPoints -= 150;
      playSound(loseSound);
    } else if (gameResult === "TIE") {
      newTies++;
      newPoints -= 30;
      playSound(tieSound);
    }

    const newGameCount = gameCount + 1;

    // 상태 업데이트
    setGameCount(newGameCount);
    setUserWins(newUserWins);
    setComputerWins(newComputerWins);
    setTies(newTies);
    setPoints(newPoints);

    if (newGameCount >= MAX_GAMES || newPoints <= 0) {
      setIsGameOver(true);
      saveGameRecord(newPoints, newUserWins, newComputerWins, newTies);
    }
  };

  const saveGameRecord = async (finalPoints, wins, losses, ties) => {
    if (gameMode === "challenge") {
      try {
        console.log("Saving game record..."); 
        const now = new Date();
        const formattedDate = now.getUTCFullYear() + '-' +
          String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
          String(now.getUTCDate()).padStart(2, '0') + ' ' +
          String(now.getUTCHours()).padStart(2, '0') + ':' +
          String(now.getUTCMinutes()).padStart(2, '0') + ':' +
          String(now.getUTCSeconds()).padStart(2, '0');
  
        const response = await axios.post('https://graze99.com/api/api.php', {
          action: 'saveRecord',
          userName,
          finalPoints: finalPoints,
          wins: wins,
          losses: losses,
          ties: ties,
          time: formattedDate,
        });
        console.log("Save response:", response.data);
        if (response.data.success) {
          console.log("Game record saved successfully");
          fetchRankings();
        } else {
          console.error("Failed to save game record:", response.data.error);
        }
      } catch (error) {
        console.error("Error saving game record:", error.response ? error.response.data : error.message);
      }
    }
  };


  const randomChoice = () => {
    const itemArray = Object.keys(choice);
    const randomItem = Math.floor(Math.random() * itemArray.length);
    const final = itemArray[randomItem];
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

  const closeNamePopup = () => {
    setShowNamePopup(false);
    setGameMode("start");
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
    setPoints(1500);
    setIsGameOver(false);
    setGameMode("start");
    setUserName("");
    fetchRankings();
  };

  const startGuestMode = () => {
    setGameMode("guest");
  };

  const startChallengeMode = () => {
    setShowNamePopup(true);
    setGameMode("challenge"); //
  };

  if (gameMode === "start") {
    return <StartPage onStartGuest={startGuestMode} onStartChallenge={startChallengeMode} />;
  }
  
  return (
    <div className='container'>
      {showNamePopup && <NameInputPopup onSubmit={handleNameSubmit} onClose={closeNamePopup} />}
      {(gameMode === "guest" || gameMode === "challenge") && (
        <div className="row d-flex flex-column mb-3 item-box">
        <div className="d-flex justify-content-center">
          <div className='col-12 title-img'>
            <img src={process.env.PUBLIC_URL + '/images/title_banner.png'} alt="Title Banner" />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-around p-2">
          <div className="item-box-r1">Total Games : {gameCount} / {MAX_GAMES}</div>
          <div className="item-box-r1">You : {userWins}</div>
          <div className="item-box-r1">Ties : {ties}</div>
          <div className="item-box-r1">Computer : {computerWins}</div>
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
          <div className='row result'>
            <Box title="You" item={userSelect} result={result}/>
            <Box title="Computer" item={computerSelect} result={result === "LOSE" ? "WIN" : result === "WIN" ? "LOSE" : result}/>
            <div className="item-box-point"><span>Points<p>{points}</p></span> </div>
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
    )}
    {gameMode === "challenge" && <RankingList rankings={rankings} />}
  </div>
);
}

export default App;