import React, { FC, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BsPeople } from 'react-icons/bs';

import pointLeft from '../../../assets/img/pointing-left.png';
import MessageForm from './MessageForm/MessageForm';
import Message from './MessageItem/MessageItem';
import { clearMessages, setMes, setWithID } from 'store/reducers/messagesSlice';

import style from './MessagesList.module.css';
import Avatar from 'components/Avatar/Avatar';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';

interface IMessagesList {
  setMobileDialogsOpen: (value: boolean) => void;
}

const MessagesList: FC<IMessagesList> = ({ setMobileDialogsOpen }) => {
  const { messagesData, dialogsData, withID } = useAppSelector(
    state => state.messages,
  );
  const { loading } = useAppSelector(state => state.app);
  const authID = useAppSelector(state => state.auth.userID)!;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, []);

  useEffect(() => {
    if (!withID) setMobileDialogsOpen(true);
    if (!withID || !authID) return;

    dispatch(setMes({ authID, withID }));
    setMobileDialogsOpen(false);
    navigate(`/messages/${withID}`, { replace: true });
  }, [withID]);

  useEffect(() => {
    if (id) dispatch(setWithID(+id));
  }, [id]);

  const dialogUser = dialogsData.find(dialog => dialog.id === withID);

  if (loading) {
    return (
      <div className={style.loading}>
        <LoaderCircular />
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <div className={style.dialog_wrapper}>
        <BsPeople
          className={style.dialogs_open}
          onClick={() => setMobileDialogsOpen(true)}
          size="60px"
        />
        {dialogUser && (
          <Link to={`/profile/${dialogUser.id}`} className={style.dialog}>
            <Avatar
              wrapperClassName={style.dialog_image}
              photoSrc={dialogUser.photoURL}
            />
            <div>{dialogUser.name}</div>
          </Link>
        )}
      </div>
      {withID ? (
        <>
          <div className={style.messages}>
            {messagesData.length > 0 ? (
              messagesData.map(data => (
                <Message key={data.id} messageData={data} />
              ))
            ) : (
              <div style={{ textAlign: 'center' }}>The dialog is empty</div>
            )}
          </div>
          <MessageForm />
        </>
      ) : (
        <div className={style.empty}>
          <img src={pointLeft} alt="icon" />
          Choose dialog
        </div>
      )}
    </div>
  );
};

export default MessagesList;
