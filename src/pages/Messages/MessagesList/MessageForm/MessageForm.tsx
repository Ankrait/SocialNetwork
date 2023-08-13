import React, { FC, KeyboardEvent, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../common/hooks';
import { addMes, getDialogs } from '../../../../store/reducers/messagesSlice';
import Input from 'components/Input/Input';

import style from './MessageForm.module.css';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';

const MessageForm: FC = () => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const isLoading = useAppSelector(state => state.messages.isNewMessageSending);
  const withID = useAppSelector(state => state.messages.withID);
  const authID = useAppSelector(state => state.auth.userID);

  const onChange = () => {
    setMessage(ref.current?.value!);
  };

  const onSubmit = async () => {
    if (!withID || !authID || !message || isLoading) return;

    const actionResult = await dispatch(addMes({ authID, withID, message }));

    if (addMes.fulfilled.match(actionResult)) {
      setMessage('');
      dispatch(getDialogs(authID));
    }
  };

  const onEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className={style.textarea}>
      <Input
        onChange={onChange}
        ref={ref}
        placeholder="mess..."
        value={message}
        className={style.textareaInput}
        onKeyDown={onEnterPressed}
      />
      <button onClick={onSubmit} className={style.btn}>
        {isLoading ? <LoaderCircular /> : <span></span>}
      </button>
    </div>
  );
};

export default MessageForm;
