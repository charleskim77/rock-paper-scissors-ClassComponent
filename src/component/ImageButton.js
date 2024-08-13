import React, { useState } from 'react';

const ImageButton = ({ defaultImage, hoverImage, onClick }) => {
    const [imgSrc, setImgSrc] = useState(defaultImage);

    return (
        <button
            className="image-button"
            onMouseEnter={() => setImgSrc(hoverImage)} // 마우스 오버 시 이미지 변경
            onMouseLeave={() => setImgSrc(defaultImage)} // 마우스 아웃 시 원래 이미지로 변경
            onClick={onClick}
        >
            <img src={imgSrc} alt="버튼 이미지" />
        </button>
    );
};

export default ImageButton;
