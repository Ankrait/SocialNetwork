import React, { FC } from 'react';

import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import { IProfile } from '../../../services/servicesTypes';
import Avatar from 'components/Avatar/Avatar';
import FollowButton from '../../../components/FollowButton/FollowButton';

import style from './UserItem.module.css';

type PropsType = {
  user: IProfile;
  authID: number | null;
};

const UserItem: FC<PropsType> = ({ user, authID }): JSX.Element => {
  return (
    <div className={style.wrapper}>
      <Avatar wrapperClassName={style.avatar} photoSrc={user.photoURL} />
      <div className={style.info}>
        <div className={style.infoBlock}>
          <NavLink to={'/profile/' + user.id} className={style.userName}>
            {user.fullName + ' ' + user.name}
          </NavLink>
          <div className={style.userAge}>{user.age}</div>
          <div className={style.userStatus}>{user.status || 'No status'}</div>
        </div>
        <div className={cn(style.infoBlock, style.place)}>
          <div>{user.location.country}</div>
          <div>{user.location.city}</div>
        </div>
      </div>
      {authID && (
        <div className={style.button}>
          <FollowButton isFollowed={user.followed} userID={user.id} />
        </div>
      )}
    </div>
  );
};

export default UserItem;
