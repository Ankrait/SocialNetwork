import React, { FC, MouseEvent, useState } from 'react';

import cn from 'classnames';

import { useAppSelector, useAppDispatch } from '../../../../common/hooks';
import { IMessage } from '../../../../services/servicesTypes';
import ContextMenu, {
  IContextMenuPos,
  IContextMenuItem,
} from '../../../../components/ContextMenu/ContextMenu';
import {
  deleteMes,
  getDialogs,
} from '../../../../store/reducers/messagesSlice';
import { setNotice } from 'store/reducers/appSlice';

import style from './MessageItem.module.css';

type PropsType = {
  messageData: IMessage;
};

const Message: FC<PropsType> = ({ messageData }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { fromID, message } = messageData;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<IContextMenuPos>({ top: 0, left: 0 });
  const authID = useAppSelector(state => state.auth.userID);

  const handleContextMenuOpen = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuOpen(true);
    setMenuPos({ top: e.clientY + 10, left: e.clientX });
  };

  const contextMenuData: IContextMenuItem[] = [
    {
      name: 'delete',
      onClick: async () => {
        await dispatch(deleteMes(messageData.id));
        await dispatch(getDialogs(authID!));
        setMenuOpen(false);
      },
    },
    {
      name: 'copy',
      onClick: () => {
        navigator.clipboard.writeText(message);
        dispatch(
          setNotice({ noticeMessage: 'Coppied!', noticeType: 'success' }),
        );
        setMenuOpen(false);
      },
    },
    {
      name: 'close',
      onClick: () => {
        setMenuOpen(false);
      },
    },
  ];

  return (
    <div className={cn(style.message, { [style.m_1]: authID !== fromID })}>
      <div className={style.image}>
        {/* <img src="" alt="User photo"/> */}
        <div onClick={handleContextMenuOpen} className={style.extra_action}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className={style.text}>{message}</div>
      {isMenuOpen && (
        <ContextMenu
          pos={menuPos}
          data={contextMenuData}
          menuOpenHandler={setMenuOpen}
        />
      )}
    </div>
  );
};

export default Message;
