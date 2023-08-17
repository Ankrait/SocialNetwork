import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

import cn from 'classnames';

import { useAppSelector, useAppDispatch } from 'common/hooks';
import { follow, unfollow } from 'store/reducers/usersSlice';

import style from './FollowButton.module.css';

interface IFollowButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isFollowed?: boolean;
  userID: number;
}

const FollowButton: FC<IFollowButton> = ({
  isFollowed,
  className,
  userID,
  ...props
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const authID = useAppSelector(state => state.auth.userID);
  const { followingInProgress } = useAppSelector(state => state.users);

  if (!authID) return <></>;

  const onClick = (action: 'follow' | 'unfollow') => {
    const thunk = action === 'follow' ? follow : unfollow;
    dispatch(thunk({ authID, userID }));
  };

  return (
    <button
      disabled={followingInProgress.includes(userID)}
      className={cn(style.button, className, {
        [style.follow]: !isFollowed,
      })}
      onClick={() => (isFollowed ? onClick('unfollow') : onClick('follow'))}
      {...props}
    >
      {isFollowed ? <>Unfollow</> : <>Follow</>}
    </button>
  );
};

export default FollowButton;
