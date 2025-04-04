import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/domains/Loading/themes/Loading.css';

const SlashPage = () => {
  const nav = useNavigate();
  useEffect(() => {
    const goTointro = () => {
      nav('/intro');
    };
    goTointro();
  });
  return (
    <div className="hacker-loader-container bg-black">
      <div className="hacker-loader">
        <div className="loader-text">
          <span
            data-text="Loading..."
            className="text-glitch">
            Loading...
          </span>
        </div>
        <div className="loader-bar">
          <div className="bar-fill"></div>
          <div className="bar-glitch"></div>
        </div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
    </div>
  );
};

export default SlashPage;
