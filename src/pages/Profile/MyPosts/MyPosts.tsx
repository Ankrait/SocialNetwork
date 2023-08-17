import React, { FC, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  postsActionStatusEnum,
  setPosts,
} from '../../../store/reducers/profileSlice';
import { getLikes } from 'store/reducers/likesSlice';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';
import EmojiMessage from 'components/EmojiMessage/EmojiMessage';
import NewPostForm from './NewPostForm/NewPostForm';
import Post from './Post/Post';
import pensiveIcon from '../../../assets/img/pensive-face.png';

import style from './MyPosts.module.css';

type PropsType = {};

const MyPosts: FC<PropsType> = () => {
  const dispatch = useAppDispatch();
  const { postsData, postsActionStatus, isOwner } = useAppSelector(
    state => state.profile,
  );
  const {
    id: userID,
    name,
    photoURL,
  } = useAppSelector(state => state.profile.profileInfo)!;
  const authID = useAppSelector(state => state.auth.userID);

  useEffect(() => {
    dispatch(setPosts(userID));
    authID && dispatch(getLikes(authID));
  }, [userID, authID, dispatch]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>{isOwner ? 'My Posts' : 'Posts'}</div>
      {isOwner && <NewPostForm />}
      <>
        <div className={style.list}>
          {postsData && postsData?.length > 0 ? (
            postsData
              .slice(0)
              .reverse()
              .map(data => {
                return (
                  <Post
                    key={data.id}
                    userInfo={{ userName: name, userPhoto: photoURL }}
                    postData={data}
                  />
                );
              })
          ) : (
            <>
              {postsActionStatus === postsActionStatusEnum.Loading ? (
                <div className={style.loader}>
                  <LoaderCircular />
                </div>
              ) : (
                <EmojiMessage
                  emojiSrc={pensiveIcon}
                  message="There are no posts yet"
                />
              )}
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default MyPosts;
