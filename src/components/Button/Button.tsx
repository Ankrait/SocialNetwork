import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import cn from 'classnames';

import style from './Button.module.css';

interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode[] | ReactNode;
  variant: 'primary' | 'danger' | 'disabled';
}

const Button: FC<IButton> = ({
  variant,
  children,
  className,
  disabled,
  ...props
}): JSX.Element => {
  return (
    <button
      disabled={disabled}
      className={cn(
        style.button,
        className,
        disabled ? style.disabled : style[variant],
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
