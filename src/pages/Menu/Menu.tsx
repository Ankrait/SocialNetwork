import React from 'react';
import { NavLink } from 'react-router-dom';
import { FC } from 'react';
import cn from 'classnames';

import { setMobileMenuOpen } from 'store/reducers/appSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

import style from './Menu.module.css';

const menuList = [
  { label: 'Profile', href: '/profile' },
  { label: 'Messages', href: '/messages' },
  { label: 'News', href: '/news' },
  { label: 'Music', href: '/music' },
  { label: 'Users', href: '/users' },
  { label: 'Settings', href: '/settings' },
];

const Menu: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen } = useAppSelector(state => state.app);

  const onMenuItemClick = () => {
    dispatch(setMobileMenuOpen(!isMobileMenuOpen));
  };

  return (
    <div className={cn(style.menu, { [style.menu_active]: isMobileMenuOpen })}>
      <ul className={style.menu__list}>
        {menuList.map((el, i) => (
          <NavLink
            key={i}
            to={el.href}
            onClick={onMenuItemClick}
            className={({ isActive }) =>
              cn(style.menu__item, {
                [style.users]: el.href === '/users',
                [style._active]: isActive,
              })
            }
          >
            {el.label}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
