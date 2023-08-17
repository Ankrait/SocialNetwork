import React, { FC, useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbMessages } from 'react-icons/tb';
import { GrClose } from 'react-icons/gr';
import cn from 'classnames';

import { useAppSelector, useAppDispatch } from '../../common/hooks';
import { logout } from '../../store/reducers/authSlice';
import { setMobileMenuOpen } from 'store/reducers/appSlice';
import Button from '../../components/Button/Button';

import style from './Header.module.css';

const Header: FC = (): JSX.Element => {
  const [scrollTop, setScrollTop] = useState(0);
  const { isAuth, login } = useAppSelector(state => state.auth);
  const { isMobileMenuOpen } = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuOpenHandler = () => {
    dispatch(setMobileMenuOpen(!isMobileMenuOpen));
  };

  return (
    <header className={cn(style.header, { [style.shadow]: scrollTop > 10 })}>
      <div className={style.burger_wrapper} onClick={menuOpenHandler}>
        <GrClose
          className={cn(style.burger, {
            [style.active]: isMobileMenuOpen,
          })}
          size="25px"
        />
        <RxHamburgerMenu
          className={cn(style.burger, {
            [style.active]: !isMobileMenuOpen,
          })}
          size="25px"
        />
      </div>
      <Link to="/" className={style.header__logo}>
        <TbMessages size="30px" />
        <p>Social Network</p>
      </Link>
      <div className={style.header__login}>
        {isAuth ? (
          <>
            {login}
            <Button variant="danger" onClick={logoutHandler}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
            <Link to="/registration">
              <Button variant="primary">Registration</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
