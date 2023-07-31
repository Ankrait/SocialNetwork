import React, { FC } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { LoaderLinear } from 'components/LoaderLinear/LoaderLinear';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { IRegisterParams } from 'services/servicesTypes';
import { register as registerTC } from '../../../store/reducers/authSlice';

import style from './RegisterForm.module.css';

interface IRegisterForm {
  registerCompleteHandler: () => void;
}

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is required'),
    login: yup
      .string()
      .max(30, 'Max length of login 30')
      .required('Login is required'),
    password: yup.string().required('Password is required'),
    // .matches(
    //   /^.*(?=.{8,})((?=.*[!#+*]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    //   'Password must match the next requirements'
    // )
    confirm_password: yup
      .string()
      .required('Password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    fullName: yup
      .string()
      .max(30, 'Max length of surname 30')
      .required('Surname is required'),
    name: yup
      .string()
      .max(30, 'Max length of name 30')
      .required('Name is required'),
    age: yup
      .number()
      .min(0, 'Min age 0')
      .max(120, 'Max age 120')
      .transform(val => (val === Number(val) ? val : null))
      .required('Age is required'),
  })
  .required();

const RegisterForm: FC<IRegisterForm> = ({ registerCompleteHandler }) => {
  const loading = useAppSelector(state => state.app.loading);
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<IRegisterParams>({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = async (data: IRegisterParams) => {
    const actionResult = await dispatch(registerTC(data));
    if (registerTC.fulfilled.match(actionResult)) {
      registerCompleteHandler();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      {loading && <LoaderLinear />}
      <div className={style.form__input}>
        <Input
          {...register('email')}
          type="text"
          placeholder="Email"
          error={errors.email?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('login')}
          type="text"
          placeholder="Login"
          error={errors.login?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('confirm_password')}
          type="password"
          placeholder="Confirm password"
          error={errors.confirm_password?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('fullName')}
          type="text"
          placeholder="Surname"
          error={errors.fullName?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('name')}
          type="text"
          placeholder="Name"
          error={errors.name?.message}
        />
      </div>
      <div className={style.form__input}>
        <Input
          {...register('age')}
          type="number"
          placeholder="Age"
          error={errors.age?.message}
        />
      </div>
      <Button
        className={style.form__btn}
        variant="primary"
        type="submit"
        disabled={!isValid || loading}
      >
        Registration
      </Button>
      <Link className={style.link} to="/login">
        Login
      </Link>
    </form>
  );
};

export default RegisterForm;
