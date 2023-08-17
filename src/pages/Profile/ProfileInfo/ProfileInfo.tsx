import React, { FC } from 'react';

import { useAppSelector } from '../../../common/hooks';
import { useNavigate, Link } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineMessage } from 'react-icons/ai';

import { IProfile } from './../../../services/servicesTypes';
import ProfileStatus from './ProfileStatus';
import FollowButton from 'components/FollowButton/FollowButton';
import Avatar from 'components/Avatar/Avatar';

import style from './ProfileInfo.module.css';

type PropsType = {
  profileInfo: IProfile;
  setEditMode: (editMode: boolean) => void;
};

const ProfileInfo: FC<PropsType> = ({
  profileInfo,
  setEditMode,
}): JSX.Element => {
  const navigate = useNavigate();
  const { isAuth, userID: authID } = useAppSelector(state => state.auth);
  const { subscribersCount, subscriptionsCount, isOwner } = useAppSelector(
    state => state.profile,
  );

  const onMessageClick = () => {
    isAuth ? navigate(`/messages/${profileInfo.id}`) : navigate('/login');
  };

  return (
    <div className={style.wrapper}>
      <div className={style.block}>
        <Avatar
          photoSrc={profileInfo.photoURL}
          wrapperClassName={style.avatar}
        />
        <div className={style.info}>
          <div className={style.name}>
            {profileInfo.fullName + ' ' + profileInfo.name}
          </div>
          <ProfileStatus isOwner={isOwner} authID={authID} />
          <div>
            {profileInfo.age && (
              <>
                Age: <b>{profileInfo.age}</b>
              </>
            )}
          </div>
          <div>
            {profileInfo.location.city && (
              <>
                City: <b>{profileInfo.location.city}</b>
              </>
            )}
          </div>
          {isOwner ? (
            <div className={style.btn}>
              <IoSettingsOutline
                size="35px"
                cursor="pointer"
                className={style.btnIcon}
                onClick={() => setEditMode(true)}
              />
            </div>
          ) : (
            <div className={style.actionsWrapper}>
              <div className={style.actions}>
                <AiOutlineMessage
                  onClick={onMessageClick}
                  size="30px"
                  cursor="pointer"
                />
                {isAuth && (
                  <FollowButton
                    userID={profileInfo.id}
                    isFollowed={profileInfo.followed}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className={style.subs}>
          <Link to={`/profile/${profileInfo.id}/sub?type=Subscriptions`}>
            <p>Subscriptions:</p> <p>{subscriptionsCount}</p>
          </Link>
          <Link to={`/profile/${profileInfo.id}/sub?type=Subscribers`}>
            <p>Subscribers:</p> <p>{subscribersCount}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
