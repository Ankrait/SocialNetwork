import React from 'react';
import style from './LoaderLinear.module.css';
import { createPortal } from 'react-dom';

export const LoaderLinear = (): JSX.Element => {
  return createPortal(
    <div className={style.loader_line} />,
    document.querySelector('body') as HTMLElement,
  );
};
 