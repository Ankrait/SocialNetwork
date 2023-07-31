import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import {
  postsActionStatusEnum,
  setPosts,
} from '../../../store/reducers/profileSlice';
import NewPostForm from './NewPostForm/NewPostForm';
import Post from './Post/Post';

import pensiveIcon from '../../../assets/img/pensive-face.png';

import style from './MyPosts.module.css';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';
import { getLikes } from 'store/reducers/likesSlice';

type PropsType = {
  isOwner: boolean;
};

const MyPosts: FC<PropsType> = ({ isOwner }) => {
  const dispatch = useAppDispatch();
  const { postsData, postsActionStatus } = useAppSelector(
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
                    isOwner={isOwner}
                  />
                );
              })
          ) : (
            <div className={style.empty}>
              {postsActionStatus === postsActionStatusEnum.Loading ? (
                <LoaderCircular />
              ) : (
                <>
                  <img src={pensiveIcon} alt="icon" />
                  There are no posts yet
                </>
              )}
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default MyPosts;
