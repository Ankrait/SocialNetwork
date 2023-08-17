import React, { FC, useEffect } from 'react';

import ReactPaginate from 'react-paginate';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { requestUsers, setCurrentPage } from '../../store/reducers/usersSlice';
import UserItem from './UserItem/UserItem';

import style from './Users.module.css';

const pageSize = 6;

let Users: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const authID = useAppSelector(state => state.auth.userID);
  const { totalCount, currentPage, users } = useAppSelector(
    state => state.users,
  );

  useEffect(() => {
    dispatch(requestUsers({ currentPage, pageSize, authID }));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  const clickOnPagination = ({ selected }: { selected: number }) => {
    if (currentPage !== selected + 1) {
      dispatch(setCurrentPage(selected + 1));
    }
  };
  const MyPagination = () => (
    <ReactPaginate
      className={style.pagination}
      activeClassName={style._active}
      breakLabel="..."
      previousLabel={<BsArrowBarLeft size="20px" />}
      nextLabel={<BsArrowBarRight size="20px" />}
      onPageChange={clickOnPagination}
      pageRangeDisplayed={2}
      forcePage={currentPage - 1}
      pageCount={Math.ceil(totalCount / pageSize)}
      renderOnZeroPageCount={null}
    />
  );

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Users</div>
      <MyPagination />
      <div className={style.list}>
        {users.map(user => (
          <UserItem user={user} authID={authID} key={user.id} />
        ))}
      </div>
      <MyPagination />
    </div>
  );
};

export default Users;
