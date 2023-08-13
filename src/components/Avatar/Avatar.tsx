import React, { FC } from 'react';
import cn from 'classnames';

import userIcon from '../../assets/img/user.png';

import style from './Avatar.module.css';

interface IAvatar {
  wrapperClassName?: string;
  className?: string;
  photoSrc: string | null;
}

const Avatar: FC<IAvatar> = ({ wrapperClassName, className, photoSrc }) => {
  return (
    <div className={cn(wrapperClassName, style.wrapper)}>
      <img
        className={cn(style.avatar, className)}
        src={photoSrc && photoSrc !== '' ? photoSrc : userIcon}
        alt="User"
        onError={e => (e.currentTarget.src = userIcon)}
      />
    </div>
  );
};

export default Avatar;
