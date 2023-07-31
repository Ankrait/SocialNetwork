import React, { FC } from 'react';
// @ts-ignore
import { ReactComponent as LoaderSvg } from './../../assets/img/loading.svg';
import cn from 'classnames';

import style from './LoaderCircular.module.css';

type IProps = {
  className?: string;
};

const LoaderCircular: FC<IProps> = ({ className }): JSX.Element => {
  return (
    <div className={cn(className, style.wrapper)}>
      <LoaderSvg />
    </div>
  );
};

export default LoaderCircular;
