import React, { Component } from "react";
import '../App.css';

export default class StartPageClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMuted: true
        };
        this.videoRef = React.createRef();
    }

    toggleMute = () => {
        if (this.videoRef.current) {
            this.videoRef.current.muted = !this.state.isMuted;
            this.setState(prevState => ({ isMuted: !prevState.isMuted }));
        }
    };

    render() {
        const { onStartGuest, onStartChallenge } = this.props;
        const { isMuted } = this.state;

        return (
            <div className="start-page">
                <div className="video-container">
                    <video ref={this.videoRef} autoPlay loop muted={isMuted}>
                        <source src={process.env.PUBLIC_URL + "/video/intro_video.mp4"} type="video/mp4" />
                    </video>
                    <button onClick={this.toggleMute} className="volume-toggle-button">
                        {isMuted ? '🔊' : '🔇'}
                    </button>
                </div>

                <div className="start-buttons">
                    <button onClick={onStartGuest} className="start-button guest">
                        Guest Mode
                    </button>
                    <button onClick={onStartChallenge} className="start-button challenge">
                        Challenge Mode
                    </button>
                </div>
            </div>
        );
    }
}
