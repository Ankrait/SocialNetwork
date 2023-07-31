import React, { useEffect } from 'react';

import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './common/hooks';
import { initialize } from './store/reducers/appSlice';

import NoticePopup from 'components/NoticePopup/NoticePopup';
import Menu from './pages/Menu/Menu';
import Header from './pages/Header/Header';

import './App.css';
import LoaderFullscreen from './components/LoaderFullscreen/LoaderFullscreen';

const App = () => {
  const isAppInitialized = useAppSelector(state => state.app.isAppInitialized);
  const main_color = useAppSelector(state => state.auth.main_color);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (main_color && rootElement) {
      rootElement.style.background = main_color;
      document.body.style.background = main_color;
    }
  }, [main_color]);

  if (!isAppInitialized) return <LoaderFullscreen />;

  return (
    <div className="wrapper">
      <div className="wrapper__container">
        <Header />
        <Menu />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <NoticePopup />
    </div>
  );
};

export default App;
