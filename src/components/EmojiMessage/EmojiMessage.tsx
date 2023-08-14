import React, { FC } from 'react';
import cn from 'classnames';

import style from './EmojiMessage.module.css';

interface IEmojiMessage {
  emojiSrc: string;
  message: string | JSX.Element;
  wrapperClassName?: string;
}

const EmojiMessage: FC<IEmojiMessage> = ({
  emojiSrc,
  message,
  wrapperClassName,
}) => {
  return (
    <div className={cn(style.wrapper, wrapperClassName)}>
      <img src={emojiSrc} alt="emoji" />
      {message}
    </div>
  );
};

export default EmojiMessage;
