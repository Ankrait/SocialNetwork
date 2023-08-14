import React from 'react';

import EmojiMessage from 'components/EmojiMessage/EmojiMessage';
import partyIcon from '../../assets/img/partying-face.png';

import style from './Home.module.css';

const Home = () => {
  const message = (
    <>
      Hello, friend
      <br />
      We are glad to welcome you to this site
      <br />
      Have fun! Good luck!
    </>
  );

  return (
    <EmojiMessage
      emojiSrc={partyIcon}
      message={message}
      wrapperClassName={style.wrapper}
    />
  );
};

export default Home;
