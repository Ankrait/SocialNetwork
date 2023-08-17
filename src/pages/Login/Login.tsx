import React, { FC, useLayoutEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { LoginForm } from './LoginForm/LoginForm';
import { useAppSelector } from '../../common/hooks';

import style from './Login.module.css';

const Login: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const isAuth = useAppSelector(state => state.auth.isAuth);

  useLayoutEffect(() => {
    if (isAuth) {
      navigate('/profile');
    }
  }, [isAuth]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Login</div>
      <LoginForm />
    </div>
  );
};

export default Login;
