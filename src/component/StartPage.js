import React, { useRef, useState } from 'react';
import '../App.css';

const StartPage = ({ onStartGuest, onStartChallenge }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="start-page">
      <div className='video-container'>
        <img src={process.env.PUBLIC_URL + '/images/event_banner.png'} alt="event_banner" />
      </div>
      <div className="video-container">
        <video ref={videoRef} autoPlay loop muted={isMuted}>
          <source src={process.env.PUBLIC_URL + "/video/intro_video.mp4"} type="video/mp4" />
        </video>
        <button onClick={toggleMute} className="volume-toggle-button">
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
};

export default StartPage;