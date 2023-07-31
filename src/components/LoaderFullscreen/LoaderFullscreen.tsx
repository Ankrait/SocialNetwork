import React, { FC } from 'react';
// @ts-ignore
import { ReactComponent as LoaderSvg } from './../../assets/img/loading.svg';
import cn from 'classnames';

import style from './LoaderFullscreen.module.css';
import { createPortal } from 'react-dom';

type IProps = {
  className?: string;
};

const LoaderFullscreen: FC<IProps> = ({ className }): JSX.Element => {
  return createPortal(
    <div className={cn(style.wrapper, className)}>
      <LoaderSvg />
    </div>,
    document.querySelector('body') as HTMLElement,
  );
};

export default LoaderFullscreen;
