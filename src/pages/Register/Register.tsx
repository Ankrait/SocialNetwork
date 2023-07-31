import React, { FC, useLayoutEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'common/hooks';

import RegisterForm from './RegisterForm/RegisterForm';
import faceIcon from '../../assets/img/smiling-face.png';

import style from './Register.module.css';

const Register: FC = () => {
  const [isRegisterCompleted, setRegisterCompleted] = useState(false);
  const navigate = useNavigate();
  const isAuth = useAppSelector(state => state.auth.isAuth);

  useLayoutEffect(() => {
    if (isAuth) {
      navigate('/profile');
    }
  }, [isAuth]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Registration</div>
      {isRegisterCompleted ? (
        <div className={style.complete_message}>
          <img src={faceIcon} alt="face" />
          <div>
            You have successfully registered. <br /> Now you can{' '}
            <Link className={style.link} to="/login">
              login
            </Link>
          </div>
        </div>
      ) : (
        <RegisterForm
          registerCompleteHandler={() => setRegisterCompleted(true)}
        />
      )}
    </div>
  );
};

export default Register;
