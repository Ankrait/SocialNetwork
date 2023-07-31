import React, { FC, useEffect, useState } from 'react';

import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import cn from 'classnames';

import { SubType } from '../../services/servicesTypes';
import { getSubs } from '../../store/reducers/subSlice';
import { useAppDispatch, useAppSelector } from 'common/hooks';
import Avatar from 'components/Avatar/Avatar';
import FollowButton from 'components/FollowButton/FollowButton';
import LoaderCircular from '../../components/LoaderCircular/LoaderCircular';

import faceIcon from '../../assets/img/face-with-monocle.png';
import style from './Sub.module.css';

const Sub: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const id = +useParams().id!;
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<SubType>('Subscriptions');
  const { users, unfollowedUserIDs } = useAppSelector(state => state.sub);
  const authID = useAppSelector(state => state.auth.userID);
  const loading = useAppSelector(state => state.app.loading);

  useEffect(() => {
    const paramsType = searchParams.get('type') as SubType;
    if (
      paramsType === null ||
      (paramsType !== 'Subscriptions' && paramsType !== 'Subscribers')
    ) {
      setSearchParams({ type: 'Subscriptions' });
    } else {
      setType(paramsType);
    }

    dispatch(getSubs({ action: paramsType, userID: id }));
  }, [id, type, searchParams]);

  const onSwitchButtonClick = (new_type: SubType) => {
    setType(new_type);
    setSearchParams({ type: new_type });
  };
  const onBackButtonClick = () => {
    navigate(`/profile/${id}`);
  };

  const switchButton = (action_type: SubType) => {
    return (
      <button
        className={cn(style.button, {
          [style._active]: type === action_type,
        })}
        onClick={() => onSwitchButtonClick(action_type)}
      >
        {action_type}
      </button>
    );
  };

  return (
    <div className={style.wrapper}>
      <button onClick={onBackButtonClick} className={style.back_button}>
        Back to profile
      </button>
      <div className={style.buttons_wrapper}>
        {switchButton('Subscriptions')}
        {switchButton('Subscribers')}
      </div>
      <div className={style.title}>
        {authID === id && 'Your '}
        {type}
      </div>
      {loading ? (
        <LoaderCircular className={style.center} />
      ) : (
        <div className={style.list}>
          {users.map(u => (
            <div key={u.id} className={style.item}>
              <Avatar photoSrc={u.photoURL} wrapperClassName={style.avatar} />
              <Link to={`/profile/${u.id}`} className={style.name}>
                {u.name}
              </Link>
              <div className={style.follow_button_wrapper}>
                {type === 'Subscriptions' && authID === id && (
                  <FollowButton
                    userID={u.id}
                    isFollowed={!unfollowedUserIDs.includes(u.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && users.length === 0 && (
        <div className={style.center}>
          <img src={faceIcon} alt="face icon" />
          No {type}
        </div>
      )}
    </div>
  );
};

export default Sub;
