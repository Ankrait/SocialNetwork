import { FC } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { login } from '../../../store/reducers/authSlice';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import { LoaderLinear } from '../../../components/LoaderLinear/LoaderLinear';
import { ILoginParams } from 'services/servicesTypes';

import style from './LoginForm.module.css';

const schema = yup
  .object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    // .matches(
    //   /^.*(?=.{8,})((?=.*[!#+*]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    //   'Password must match the next requirements'
    // )
    rememberMe: yup.boolean(),
  })
  .required();

export const LoginForm: FC = (): JSX.Element => {
  const {
    register,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<ILoginParams>({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const loading = useAppSelector(state => state.app.loading);
  const dispatch = useAppDispatch();

  const onSubmit = (data: ILoginParams) => {
    dispatch(login(data));
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
          {...register('password')}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
        />
      </div>
      <div className={style.form__input}>
        <input {...register('rememberMe')} id="rememberMe" type="checkbox" />
        <label htmlFor="rememberMe">Remember me</label>
      </div>
      <Button
        className={style.form__btn}
        variant="primary"
        type="submit"
        disabled={!isValid || loading}
      >
        Login
      </Button>
      <Link className={style.link} to="/registration">
        Registration
      </Link>
    </form>
  );
};
