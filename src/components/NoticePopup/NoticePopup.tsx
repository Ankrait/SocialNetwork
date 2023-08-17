import React, { FC, useEffect, useState } from 'react';

import cn from 'classnames';
import { createPortal } from 'react-dom';
import { TbInfoHexagon } from 'react-icons/tb';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { setNotice } from 'store/reducers/appSlice';

import style from './NoticePopup.module.css';

const NoticePopup: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { noticeMessage, noticeType } = useAppSelector(
    state => state.app.notice,
  );

  const handleNoticePopupClose = (): void => {
    setIsOpen(false);
    dispatch(setNotice({ noticeMessage: null, noticeType: null }));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (noticeMessage) {
      setIsOpen(true);
      timer = setTimeout(() => {
        handleNoticePopupClose();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [noticeMessage]);

  return createPortal(
    isOpen && (
      <div
        onClick={handleNoticePopupClose}
        className={cn(style.wrapper, style[noticeType!])}
      >
        <TbInfoHexagon className={style.icon} size="24px" />
        {noticeMessage}
      </div>
    ),
    document.querySelector('body') as HTMLElement,
  );
};
export default NoticePopup;
