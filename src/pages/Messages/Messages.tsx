import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
// import Preloader from 'my-comp/common/Preloader/Preloader';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { useNavigate } from 'react-router-dom';

import MessagesList from './MessagesList/MessagesList';
import DialogsList from './DialogsList/DialogsList';

import style from './Messages.module.css';

const Messages: FC = (): JSX.Element => {
  const [isMobileDialogsOpen, setMobileDialogsOpen] = useState(false);
  const authID = useAppSelector(state => state.auth.userID);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!authID) {
      navigate('/login');
    }
  }, [authID]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Messages</div>
      <div className={style.body}>
        <DialogsList
          isOnMobileOpen={isMobileDialogsOpen}
          setOnMobileOpen={setMobileDialogsOpen}
        />
        <MessagesList setMobileDialogsOpen={setMobileDialogsOpen} />
      </div>
    </div>
  );
};

export default Messages;
