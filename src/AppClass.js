import React, { Component } from "react";
import './App.css';
import Box from './component/BoxClass';
import ImageButton from './component/ImageButtonClass';
import NameInputPopup from './component/NameInputPopupClass';
import RankingList from './component/RankingListClass';
import StartPage from './component/StartPageClass';
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

export default class AppClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSelect: null,
            computerSelect: null,
            result: "",
            gameCount: 0,
            userWins: 0,
            computerWins: 0,
            ties: 0,
            points: 1500,
            isGameOver: false,
            userName: "",
            rankings: [],
            gameMode: "start", // "start", "guest", "challenge"
            showNamePopup: false,
            buttonSound: new Audio(process.env.PUBLIC_URL + "/audio/button.mp3"),
            winSound: new Audio(process.env.PUBLIC_URL + "/audio/win.mp3"),
            loseSound: new Audio(process.env.PUBLIC_URL + "/audio/lose.mp3"),
            tieSound: new Audio(process.env.PUBLIC_URL + "/audio/tie.mp3"),
        };
    }

    componentDidMount() {
        const sounds = [this.state.buttonSound, this.state.winSound, this.state.loseSound, this.state.tieSound];
        sounds.forEach(sound => {
            sound.load();
            sound.onerror = () => {
                console.error(`Error loading sound: ${sound.src}`);
            };
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.gameMode !== this.state.gameMode && this.state.gameMode === "challenge") {
            this.fetchRankings();
        }
    }

    fetchRankings = async () => {
        try {
            const response = await axios.get('https://graze99.com/api/api.php?action=getRankings');
            if (Array.isArray(response.data)) {
                this.setState({ rankings: response.data });
            } else {
                console.error("Fetched rankings is not an array:", response.data);
                this.setState({ rankings: [] });
            }
        } catch (error) {
            console.error("Error fetching rankings:", error);
            this.setState({ rankings: [] });
        }
    };

    playSound = (sound) => {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.error("Error playing sound:", error);
        });
    };

    updatePoints = (change) => {
        this.setState(prevState => {
            const newPoints = prevState.points + change;
            if (newPoints <= 0) {
                return { points: 0, isGameOver: true };
            }
            return { points: newPoints };
        });
    };

    play = (userChoice) => {
        if (this.state.isGameOver || this.state.gameCount >= MAX_GAMES) return;

        this.playSound(this.state.buttonSound);
        const computerChoice = this.randomChoice();
        const gameResult = this.judgement(choice[userChoice], computerChoice);

        let newPoints = this.state.points;
        let newUserWins = this.state.userWins;
        let newComputerWins = this.state.computerWins;
        let newTies = this.state.ties;

        if (gameResult === "WIN") {
            newUserWins++;
            newPoints += 150;
            this.playSound(this.state.winSound);
        } else if (gameResult === "LOSE") {
            newComputerWins++;
            newPoints -= 150;
            this.playSound(this.state.loseSound);
        } else if (gameResult === "TIE") {
            newTies++;
            newPoints -= 30;
            this.playSound(this.state.tieSound);
        }

        const newGameCount = this.state.gameCount + 1;

        this.setState({
            userSelect: choice[userChoice],
            computerSelect: computerChoice,
            result: gameResult,
            gameCount: newGameCount,
            userWins: newUserWins,
            computerWins: newComputerWins,
            ties: newTies,
            points: newPoints,
        }, () => {
            if (newGameCount >= MAX_GAMES || newPoints <= 0) {
                this.setState({ isGameOver: true }, () => {
                    this.saveGameRecord(newPoints, newUserWins, newComputerWins, newTies);
                });
            }
        });
    };

    saveGameRecord = async (finalPoints, wins, losses, ties) => {
        if (this.state.gameMode === "challenge") {
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
                    userName: this.state.userName,
                    finalPoints: finalPoints,
                    wins: wins,
                    losses: losses,
                    ties: ties,
                    time: formattedDate,
                });
                console.log("Save response:", response.data);
                if (response.data.success) {
                    console.log("Game record saved successfully");
                    this.fetchRankings();
                } else {
                    console.error("Failed to save game record:", response.data.error);
                }
            } catch (error) {
                console.error("Error saving game record:", error.response ? error.response.data : error.message);
            }
        }
    };

    randomChoice = () => {
        const itemArray = Object.keys(choice);
        const randomItem = Math.floor(Math.random() * itemArray.length);
        const final = itemArray[randomItem];
        return choice[final];
    };

    judgement = (user, computer) => {
        if (user.name === computer.name) {
            return "TIE";
        } else if (user.name === "Rock") return computer.name === "Scissors" ? "WIN" : "LOSE";
        else if (user.name === "Scissors") return computer.name === "Paper" ? "WIN" : "LOSE";
        else if (user.name === "Paper") return computer.name === "Rock" ? "WIN" : "LOSE";
    };

    handleNameSubmit = (name) => {
        this.setState({
            userName: name,
            showNamePopup: false,
            gameMode: "challenge"
        });
    };

    closeNamePopup = () => {
        this.setState({
            showNamePopup: false,
            gameMode: "start"
        });
    };

    resetGame = () => {
        this.playSound(this.state.buttonSound);
        this.setState({
            userSelect: null,
            computerSelect: null,
            result: "",
            gameCount: 0,
            userWins: 0,
            computerWins: 0,
            ties: 0,
            points: 1500,
            isGameOver: false,
            gameMode: "start",
            userName: ""
        }, this.fetchRankings);
    };

    startGuestMode = () => {
        this.setState({ gameMode: "guest" });
    };

    startChallengeMode = () => {
        this.setState({
            showNamePopup: true,
            gameMode: "challenge"
        });
    };

    render() {
        if (this.state.gameMode === "start") {
            return <StartPage onStartGuest={this.startGuestMode} onStartChallenge={this.startChallengeMode} />;
        }

        return (
            <div className='container'>
                {this.state.showNamePopup && <NameInputPopup onSubmit={this.handleNameSubmit} onClose={this.closeNamePopup} />}
                {(this.state.gameMode === "guest" || this.state.gameMode === "challenge") && (
                    <div className="row d-flex flex-column mb-3 item-box">
                        <div className="d-flex justify-content-center mb-2">
                            <div className='col-12 title-img'>
                                <img src={process.env.PUBLIC_URL + '/images/title_banner.png'} alt="Title Banner" />
                            </div>
                        </div>

                        <div className="alert alert-info text-center" role="alert">
                            이길 경우 +150 포인트 / 패배 시 -150 포인트 / 비길 경우 -30 포인트
                            {this.state.isGameOver && this.state.points <= 0 && (
                                <p className="mt-2 text-danger font-weight-bold">
                                    포인트를 모두 잃었습니다. 더 이상 진행이 불가합니다.
                                </p>
                            )}
                            {this.state.isGameOver && this.state.gameCount >= MAX_GAMES && (
                                <p className="mt-2 text-danger font-weight-bold">
                                    도전 가능한 최종 게임 횟수에 도달했습니다.
                                </p>
                            )}
                        </div>

                        <div className="d-flex flex-wrap justify-content-between box-p-m">
                            <div className="item-box-r1">Total Games : {this.state.gameCount} / {MAX_GAMES}</div>
                            <div className="item-box-r1">You : {this.state.userWins}</div>
                            <div className="item-box-r1">Ties : {this.state.ties}</div>
                            <div className="item-box-r1">Computer : {this.state.computerWins}</div>
                        </div>

                        <div className="d-flex flex-wrap justify-content-between box-p-m">
                            <div className="item-box-point"> <span>Points : {this.state.points}</span> </div>
                            <div className="item-box-reset"> <button className="resetButton" onClick={this.resetGame}>Reset</button></div>
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                            <div className='row result'>
                                <Box title="You" item={this.state.userSelect} result={this.state.result} />
                                <Box title="Computer" item={this.state.computerSelect} result={this.state.result === "LOSE" ? "WIN" : this.state.result === "WIN" ? "LOSE" : this.state.result} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mt-4 mb-4">
                            <ImageButton
                                defaultImage={process.env.PUBLIC_URL + '/images/button-scissors.png'}
                                hoverImage={process.env.PUBLIC_URL + '/images/button-scissors-hover.png'}
                                onClick={() => this.play('scissors')}
                                disabled={this.state.isGameOver}
                            />
                            <ImageButton
                                defaultImage={process.env.PUBLIC_URL + '/images/button-rock.png'}
                                hoverImage={process.env.PUBLIC_URL + '/images/button-rock-hover.png'}
                                onClick={() => this.play('rock')}
                                disabled={this.state.isGameOver}
                            />
                            <ImageButton
                                defaultImage={process.env.PUBLIC_URL + '/images/button-paper.png'}
                                hoverImage={process.env.PUBLIC_URL + '/images/button-paper-hover.png'}
                                onClick={() => this.play('paper')}
                                disabled={this.state.isGameOver}
                            />
                        </div>

                    </div>
                )}
                {this.state.gameMode === "challenge" && <RankingList rankings={this.state.rankings} />}
            </div>
        );
    }
}