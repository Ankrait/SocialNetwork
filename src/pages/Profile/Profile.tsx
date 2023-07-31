import React, { FC, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { clearProfile, setProfile } from '../../store/reducers/profileSlice';

import cloudFace from '../../assets/img/face-in-clouds.png';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import MyPosts from './MyPosts/MyPosts';
import ProfileForm from './ProfileForm/ProfileForm';
import LoaderCircular from '../../components/LoaderCircular/LoaderCircular';

import style from './Profile.module.css';

const Profile: FC = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(state => state.app.loading);
  const authID = useAppSelector(state => state.auth.userID);
  const profileInfo = useAppSelector(state => state.profile.profileInfo);

  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let userID: number;

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
    setIsOwner(authID === profileInfo?.id);
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
          <div className={style.empty}>
            <img src={cloudFace} alt="face" />
            The user with this id not found
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <div>
        <ProfileInfo
          setEditMode={setEditMode}
          isOwner={isOwner}
          profileInfo={profileInfo}
        />

        <MyPosts isOwner={isOwner} />
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
