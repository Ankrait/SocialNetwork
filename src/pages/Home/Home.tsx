import React from 'react';

import partyIcon from '../../assets/img/partying-face.png';

import style from './Home.module.css';

const Home = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.image}>
        <img src={partyIcon} alt="Hello" />
      </div>
      <div>
        Hello, friend
        <br />
        We are glad to welcome you to this site
        <br />
        Have fun! Good luck!
      </div>
    </div>
  );
};

export default Home;
