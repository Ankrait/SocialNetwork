import React, { FC } from 'react';

import { ReactComponent as LoaderSvg } from './../../assets/img/loading.svg';
import cn from 'classnames';

import style from './LoaderCircular.module.css';

interface ILoaderCircular {
  className?: string;
}

const LoaderCircular: FC<ILoaderCircular> = ({ className }): JSX.Element => {
  return (
    <div className={cn(style.wrapper, className)}>
      <LoaderSvg />
    </div>
  );
};

export default LoaderCircular;
