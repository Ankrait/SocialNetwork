import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
} from 'react';

import style from './Input.module.css';
import cn from 'classnames';

interface IInput
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: string;
  classNameWrapper?: string;
  className?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, IInput>(
  (
    { error, classNameWrapper, className, label, ...restProps },
    ref,
  ): JSX.Element => {
    return (
      <div className={cn(style.wrapper, classNameWrapper)}>
        {label && <p className={style.label}>{label}</p>}
        <input
          className={cn(style.input, className, { [style.error]: !!error })}
          ref={ref}
          {...restProps}
        />
        {error && <p className={style.errorMes}>{error}</p>}
      </div>
    );
  },
);

export default Input;
