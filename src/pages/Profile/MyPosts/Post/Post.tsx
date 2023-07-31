import React, { FC } from 'react';

import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

import { IPost, ISetLikesParams } from '../../../../services/servicesTypes';
import { useAppDispatch, useAppSelector } from '../../../../common/hooks';
import {
  postsActionStatusEnum,
  removePost,
} from '../../../../store/reducers/profileSlice';
import { deleteLike, setLike } from 'store/reducers/likesSlice';
import LoaderCircular from '../../../../components/LoaderCircular/LoaderCircular';

// @ts-ignore
import userIcon from '../../../../assets/img/user.png';
import { AiFillLike } from 'react-icons/ai';
import { BiRepost } from 'react-icons/bi';
import { RiDeleteBin5Fill } from 'react-icons/ri';

import style from './Post.module.css';

type PropsType = {
  userInfo: { userName: string; userPhoto: string | null };
  postData: IPost;
  isOwner: boolean;
};

const Post: FC<PropsType> = ({ userInfo, postData }): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { likes: userLikes, loading: isLoading } = useAppSelector(
    state => state.likes,
  );
  const authID = useAppSelector(state => state.auth.userID);
  const { postsActionStatus } = useAppSelector(state => state.profile);

  const removePostHandler = (id: number): void => {
    dispatch(removePost(id));
  };

  const onLikeClick = () => {
    if (isLoading) {
      return;
    }

    if (!authID) {
      navigate('/login');
      return;
    }

    const params: ISetLikesParams = {
      userID: authID,
      postID: postData.id,
      likesCount: postData.likes,
    };

    if (userLikes.find(el => el.postID === postData.id)) {
      dispatch(deleteLike(params));
    } else {
      dispatch(setLike(params));
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.user}>
        <div className={style.userImage}>
          <img src={userInfo.userPhoto || userIcon} alt="User" />
        </div>
        <div className={style.userName}>{userInfo.userName}</div>
      </div>
      {postData.img_link ? (
        <div className={style.image}>
          <img src={postData.img_link} alt="Post" />
        </div>
      ) : null}
      <div className={style.text}>{postData.message}</div>
      <div className={style.stats}>
        <div
          onClick={onLikeClick}
          className={cn(style.statsItem, {
            [style.active]: userLikes.find(el => el.postID === postData.id),
            [style.disabled]: isLoading,
          })}
        >
          <AiFillLike size="20px" />
          {postData.likes}
        </div>
        <div className={style.statsItem}>
          <BiRepost size="25px" />
          {postData.reposts}
        </div>
      </div>
      <div className={style.removePost}>
        {postsActionStatus === postsActionStatusEnum.Removing ? (
          <LoaderCircular />
        ) : (
          <RiDeleteBin5Fill
            onClick={() => removePostHandler(postData.id)}
            size="20px"
            color="#df4747"
          />
        )}
      </div>
    </div>
  );
};

export default Post;
