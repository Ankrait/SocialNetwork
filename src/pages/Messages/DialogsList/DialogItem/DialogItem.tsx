import React, { FC, MouseEvent, useRef, useState } from 'react';

import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

import Avatar from 'components/Avatar/Avatar';
import { IReducedUser } from 'services/servicesTypes';
import ContextMenu, {
  IContextMenuItem,
  IContextMenuPos,
} from 'components/ContextMenu/ContextMenu';

import style from './DialogItem.module.css';

interface IDialogItem {
  dialogData: IReducedUser;
  active?: boolean;
  onClick: () => void;
}

const DialogItem: FC<IDialogItem> = ({
  dialogData,
  active,
  onClick,
}): JSX.Element => {
  const navigate = useNavigate();
  const extraActionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<IContextMenuPos>({ top: 0, left: 0 });

  const handleContextMenuOpen = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuOpen(true);
    setMenuPos({ top: e.clientY + 10, left: e.clientX });
  };

  const contextMenuData: IContextMenuItem[] = [
    {
      name: 'go to user',
      onClick() {
        navigate(`/profile/${dialogData.id}`);
        setMenuOpen(false);
      },
    },
    {
      name: 'close',
      onClick() {
        setMenuOpen(false);
      },
    },
  ];

  const onClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== extraActionRef.current) {
      onClick();
    }
  };

  return (
    <div
      onClick={onClickHandler}
      className={cn(style.dialog, { [style._active]: active })}
    >
      <Avatar
        wrapperClassName={style.image}
        photoSrc={dialogData.photoURL ?? null}
      />
      <div className={style.name}>{dialogData.name}</div>
      <div
        ref={extraActionRef}
        onClick={handleContextMenuOpen}
        className={style.extra_action}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
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

export default DialogItem;
