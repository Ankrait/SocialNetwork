import React, { FC, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  clearProfile,
  setIsOwner,
  setProfile,
} from '../../store/reducers/profileSlice';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import cloudFace from '../../assets/img/face-in-clouds.png';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPosts from './MyPosts/MyPosts';
import ProfileForm from './ProfileForm/ProfileForm';
import LoaderCircular from '../../components/LoaderCircular/LoaderCircular';
import EmojiMessage from 'components/EmojiMessage/EmojiMessage';

import style from './Profile.module.css';

const Profile: FC = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(state => state.app.loading);
  const authID = useAppSelector(state => state.auth.userID);
  const { profileInfo, isOwner } = useAppSelector(state => state.profile);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let userID: number;

    dispatch(clearProfile());

    if (id) {
      userID = +id;
    } else if (authID) {
      userID = authID;
    } else {
      navigate('/login');
      return;
    }

    dispatch(setProfile({ userID, authID }));
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(clearProfile());
    };
  }, []);

  useEffect(() => {
    dispatch(setIsOwner(authID === profileInfo?.id));
  }, [profileInfo]);

  useEffect(() => {
    editMode
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }, [editMode]);

  if (!profileInfo) {
    return (
      <>
        {loading ? (
          <LoaderCircular className={style.loader} />
        ) : (
          <EmojiMessage
            emojiSrc={cloudFace}
            message="User with this id not found"
            wrapperClassName={style.empty}
          />
        )}
      </>
    );
  }
  return (
    <>
      <div>
        <ProfileInfo setEditMode={setEditMode} profileInfo={profileInfo} />

        <MyPosts />
      </div>
      {editMode && isOwner && (
        <ProfileForm
          initialValues={profileInfo}
          setEditMode={setEditMode}
          authID={authID!}
        />
      )}
      {loading && <LoaderCircular className={style.loader} />}
    </>
  );
};

export default Profile;
