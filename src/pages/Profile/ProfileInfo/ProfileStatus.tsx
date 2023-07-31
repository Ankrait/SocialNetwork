import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { updateStatus } from '../../../store/reducers/profileSlice';
import { BiSend } from 'react-icons/bi';

import style from './ProfileInfo.module.css';
import ClickAwayListener from 'react-click-away-listener';
import LoaderCircular from '../../../components/LoaderCircular/LoaderCircular';

type PropsType = {
  isOwner: boolean;
  authID: number | null;
};

const ProfileStatus: FC<PropsType> = (props): JSX.Element => {
  const { isOwner, authID } = props;
  const status = useAppSelector(
    state => state.profile.profileInfo?.status || '',
  );
  const { loading } = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const ref = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [statusMod, setStatusMod] = useState('');

  useEffect(() => {
    setStatusMod(status);
  }, [status]);

  const activateEditMode = () => {
    if (!isOwner) return;
    setEditMode(true);
  };

  const deactivateEditMode = () => {
    setEditMode(false);
    setStatusMod(status);
  };

  const sendStatus = async () => {
    if (!isOwner) return;

    const data = {
      authID: authID!,
      status: statusMod,
    };
    await dispatch(updateStatus(data));

    setEditMode(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendStatus();
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatusMod(e.currentTarget.value);
  };

  return (
    <div className={style.status}>
      <div
        onClick={activateEditMode}
        className={isOwner ? style.statusHover : ''}
      >
        {status || 'No status'}
      </div>
      {editMode && isOwner && (
        <ClickAwayListener onClickAway={deactivateEditMode}>
          <div className={style.statusEdit}>
            <input
              autoFocus
              onKeyDown={onKeyDown}
              onChange={onInputChange}
              value={statusMod}
            ></input>
            <button onClick={sendStatus} disabled={loading} ref={ref}>
              {loading ? (
                <LoaderCircular />
              ) : (
                <BiSend size="25px" cursor="pointer" />
              )}
            </button>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default ProfileStatus;
