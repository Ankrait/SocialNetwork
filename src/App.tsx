import React, { useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './common/hooks';
import { initialize } from './store/reducers/appSlice';
import { MAIN_COLOR } from './common/constants';

import NoticePopup from './components/NoticePopup/NoticePopup';
import LoaderFullscreen from './components/LoaderFullscreen/LoaderFullscreen';
import Menu from './pages/Menu/Menu';
import Header from './pages/Header/Header';

import style from './App.module.css';

const App = () => {
  const isAppInitialized = useAppSelector(state => state.app.isAppInitialized);
  const main_color = useAppSelector(state => state.auth.main_color);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.background = main_color ?? MAIN_COLOR;
      document.body.style.background = main_color ?? MAIN_COLOR;
    }
  }, [main_color]);

  if (!isAppInitialized) return <LoaderFullscreen />;

  return (
    <div className={style.wrapper}>
      <div className={style.wrapper__container}>
        <Header />
        <Menu />
        <div className={style.content}>
          <Outlet />
        </div>
      </div>
      <NoticePopup />
    </div>
  );
};

export default App;
