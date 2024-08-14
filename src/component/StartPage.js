import React, { useRef, useState } from 'react';
import '../App.css';

const StartPage = ({ onStartGuest, onStartChallenge }) => {
  const videoRef = useRef(null); // video 요소에 대한 참조 생성
  const [isMuted, setIsMuted] = useState(true); // 기본적으로 음소거 상태로 시작

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted; // 비디오의 muted 속성 토글
      setIsMuted(!isMuted); // 상태 업데이트
    }
  };

  return (
    <div className="start-page">
      <div className="video-container">
        <video ref={videoRef} autoPlay loop muted={isMuted}> {/* muted를 상태에 따라 설정 */}
          <source src={process.env.PUBLIC_URL + "/video/intro_video.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button onClick={toggleMute} className="volume-toggle-button">
          {isMuted ? '🔊' : '🔇'} {/* 버튼 아이콘 변경 */}
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
