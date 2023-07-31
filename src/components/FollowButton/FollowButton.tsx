import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

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

  const onFollowClick = (authID: number, userID: number) => {
    dispatch(follow({ authID, userID }));
  };
  const onUnfollowClick = (authID: number, userID: number) => {
    dispatch(unfollow({ authID, userID }));
  };

  return authID ? (
    <button
      disabled={followingInProgress.includes(userID)}
      className={cn(style.button, className, {
        [style.follow]: !isFollowed,
      })}
      onClick={() =>
        isFollowed
          ? onUnfollowClick(authID, userID)
          : onFollowClick(authID, userID)
      }
      {...props}
    >
      {isFollowed ? <>Unfollow</> : <>Follow</>}
    </button>
  ) : (
    <></>
  );
};

export default FollowButton;
