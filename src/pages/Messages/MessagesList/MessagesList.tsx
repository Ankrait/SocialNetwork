import React, { FC, useEffect, useRef } from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';
import { BsPeople } from 'react-icons/bs';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { clearMessages, setMes, setWithID } from 'store/reducers/messagesSlice';
import MessageForm from './MessageForm/MessageForm';
import Message from './MessageItem/MessageItem';
import Avatar from 'components/Avatar/Avatar';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';
import EmojiMessage from 'components/EmojiMessage/EmojiMessage';
import pointLeft from '../../../assets/img/pointing-left.png';

import style from './MessagesList.module.css';

interface IMessagesList {
  setMobileDialogsOpen: (value: boolean) => void;
}

const MessagesList: FC<IMessagesList> = ({ setMobileDialogsOpen }) => {
  const { messagesData, dialogsData, withID, isNewMessageSending } =
    useAppSelector(state => state.messages);
  const { loading } = useAppSelector(state => state.app);
  const authID = useAppSelector(state => state.auth.userID)!;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const messagesBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, []);

  useEffect(() => {
    dispatch(clearMessages());
    if (!withID) setMobileDialogsOpen(true);
    if (!withID || !authID) return;

    dispatch(setMes({ authID, withID }));
    setMobileDialogsOpen(false);
    navigate(`/messages/${withID}`, { replace: true });
  }, [withID]);

  useEffect(() => {
    if (id) dispatch(setWithID(+id));
  }, [id]);

  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const dialogUser = dialogsData.find(dialog => dialog.id === withID);

  if (loading && !isNewMessageSending) {
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
            <div ref={messagesBottomRef}></div>
          </div>
          <MessageForm />
        </>
      ) : (
        <EmojiMessage
          emojiSrc={pointLeft}
          message="Choose dialog"
          wrapperClassName={style.empty}
        />
      )}
    </div>
  );
};

export default MessagesList;
