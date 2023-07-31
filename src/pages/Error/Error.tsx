import React from 'react';
import style from './Error.module.css';
import { BiError } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className={style.wrapper}>
      <div>
        <BiError size="60px" color="red" />
      </div>
      <div>
        Some error occured, we apologize for this.
        <br />
        Try to reload this page or go to <Link to="/">main page</Link>
      </div>
    </div>
  );
};

export default Error;
