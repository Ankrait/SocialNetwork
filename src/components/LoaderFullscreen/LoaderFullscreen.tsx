import React, { FC } from 'react';

import { createPortal } from 'react-dom';
import cn from 'classnames';

import { ReactComponent as LoaderSvg } from './../../assets/img/loading.svg';

import style from './LoaderFullscreen.module.css';

interface ILoaderFullscreen {
  className?: string;
}

const LoaderFullscreen: FC<ILoaderFullscreen> = ({
  className,
}): JSX.Element => {
  return createPortal(
    <div className={cn(style.wrapper, className)}>
      <LoaderSvg />
    </div>,
    document.querySelector('body') as HTMLElement,
  );
};

export default LoaderFullscreen;
