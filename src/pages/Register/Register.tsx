import React, { FC, useLayoutEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'common/hooks';

import RegisterForm from './RegisterForm/RegisterForm';
import faceIcon from '../../assets/img/smiling-face.png';

import style from './Register.module.css';
import EmojiMessage from 'components/EmojiMessage/EmojiMessage';

const Register: FC = () => {
  const [isRegisterCompleted, setRegisterCompleted] = useState(false);
  const navigate = useNavigate();
  const isAuth = useAppSelector(state => state.auth.isAuth);

  useLayoutEffect(() => {
    if (isAuth) {
      navigate('/profile');
    }
  }, [isAuth]);

  const completeMessage = (
    <>
      You have successfully registered. <br /> Now you can{' '}
      <Link className={style.link} to="/login">
        login
      </Link>
    </>
  );

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Registration</div>
      {isRegisterCompleted ? (
        <EmojiMessage
          emojiSrc={faceIcon}
          wrapperClassName={style.complete_message}
          message={completeMessage}
        />
      ) : (
        <RegisterForm
          registerCompleteHandler={() => setRegisterCompleted(true)}
        />
      )}
    </div>
  );
};

export default Register;
