import React, { FC, MouseEvent } from 'react';

import style from './ContextMenu.module.css';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from 'common/hooks';

export interface IContextMenuItem {
  name: string;
  onClick: (e?: MouseEvent<HTMLElement>) => void;
}

export interface IContextMenuPos {
  top: number;
  left: number;
}

interface IContextMenu {
  pos: IContextMenuPos;
  data: IContextMenuItem[];
  menuOpenHandler: (value: boolean) => void;
}

const ContextMenu: FC<IContextMenu> = ({ pos, data, menuOpenHandler }) => {
  const triggerRef = useOnClickOutside<HTMLDivElement>(menuOpenHandler);

  return createPortal(
    <div ref={triggerRef} style={{ ...pos }} className={style.wrapper}>
      <ul className={style.list}>
        {data.map(element => (
          <li key={element.name} onClick={element.onClick} className={style.item}>
            {element.name}
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
};

export default ContextMenu;
