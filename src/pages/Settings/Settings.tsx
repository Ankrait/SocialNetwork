import React, { useLayoutEffect, useState } from 'react';

import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

import { IoIosArrowDown } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from 'common/hooks';

import style from './Settings.module.css';
import { setColor } from 'store/reducers/authSlice';

const colors = [
  '#AFDAFC',
  '#FFD1DC',
  '#FF8C69',
  '#FF9BAA',
  '#99FF99',
  '#E5E4E2',
  '#E4717A',
  '#D8BFD8',
];

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isColorMenuOpen, setColorMenuOpen] = useState(false);
  const authID = useAppSelector(state => state.auth.userID);
  const main_color = useAppSelector(state => state.auth.main_color);

  const colorMenuOpenHandler = () => {
    setColorMenuOpen(prev => !prev);
  };

  useLayoutEffect(() => {
    !authID && navigate('/login');
  }, [authID]);

  const onColorChangeHandler = (main_color: string) => {
    authID && dispatch(setColor({ authID, main_color }));
    setColorMenuOpen(false);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Settings</div>
      <div className={style.content}>
        <div>Choose main color:</div>
        <div className={style.choose_color}>
          <div
            onClick={colorMenuOpenHandler}
            className={cn(style.choose_color_header, style.choose_color_block)}
          >
            <div className={style.color} style={{ background: main_color }} />
            <IoIosArrowDown
              className={cn(style.arrow, { [style.active]: isColorMenuOpen })}
            />
          </div>
          {isColorMenuOpen && (
            <div className={style.choose_color_menu}>
              {colors.map(color => (
                <div
                  key={color}
                  onClick={() => onColorChangeHandler(color)}
                  className={cn(style.choose_color_block, {
                    [style.active]: main_color === color,
                  })}
                >
                  <div
                    className={style.color}
                    style={{ background: color }}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
