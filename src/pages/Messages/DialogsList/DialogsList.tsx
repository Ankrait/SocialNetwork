import React, { FC, useEffect } from 'react';

import cn from 'classnames';
import { useAppSelector, useAppDispatch } from '../../../common/hooks';
import { GrClose } from 'react-icons/gr';

import DialogItem from './DialogItem/DialogItem';
import { getDialogs, setWithID } from 'store/reducers/messagesSlice';

import style from './DialogsList.module.css';

interface IDialogsList {
  isOnMobileOpen: boolean;
  setOnMobileOpen: (value: boolean) => void;
}

const DialogsList: FC<IDialogsList> = ({
  isOnMobileOpen,
  setOnMobileOpen,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const { dialogsData, withID } = useAppSelector(state => state.messages);
  const authID = useAppSelector(state => state.auth.userID)!;

  useEffect(() => {
    dispatch(getDialogs(authID));
  }, []);

  const setDialog = (id: number) => {
    dispatch(setWithID(id));
    setOnMobileOpen(false);
  };

  return (
    <div className={cn(style.wrapper, { [style.visible]: isOnMobileOpen })}>
      <GrClose
        onClick={() => setOnMobileOpen(false)}
        className={style.on_mobile_close}
        size="20px"
      />
      {dialogsData.map(data => (
        <DialogItem
          key={data.id}
          onClick={() => setDialog(data.id)}
          dialogData={data}
          active={data.id === withID}
        />
      ))}
    </div>
  );
};

export default DialogsList;
