import React, { FC, MouseEventHandler } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import * as yup from 'yup';
import { createPortal } from 'react-dom';

import { IProfile } from '../../../services/servicesTypes';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { saveProfileInfo } from '../../../store/reducers/profileSlice';
import Input from 'components/Input/Input';
import Button from '../../../components/Button/Button';
import { GrClose } from 'react-icons/gr';
import { LoaderLinear } from '../../../components/LoaderLinear/LoaderLinear';

import style from './ProfileForm.module.css';

type PropsType = {
  setEditMode: (val: boolean) => void;
  initialValues: IProfile;
  authID: number;
};

const schema = yup.object({
  id: yup.number().required(),
  fullName: yup.string().required().max(20, 'Max 20 simbols'),
  name: yup.string().required().max(20, 'Max 20 simbols'),
  age: yup
    .number()
    .min(10)
    .max(110)
    .nullable()
    .transform((val) => (val === Number(val) ? val : null)),
  status: yup.string().max(250, 'Max status length 250'),
  location: yup.object({
    city: yup.string().max(20, 'Max 20 simbols'),
    country: yup.string().max(20, 'Max 20 simbols'),
  }),
  photoURL: yup.string(),
  followed: yup.boolean(),
});

const ChangeProfileForm: FC<PropsType> = ({
  setEditMode,
  initialValues,
  authID,
}) => {
  const { loading } = useAppSelector(state => state.app);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<IProfile>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: IProfile) => {
    const actionResult = await dispatch(saveProfileInfo({ authID, data }));
    if (saveProfileInfo.fulfilled.match(actionResult)) {
      setEditMode(false);
    }
  };

  const onReset = () => {
    reset(initialValues);
  };

  const onBackClick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.target === e.currentTarget && !loading) {
      setEditMode(false);
    }
  };

  return createPortal(
    <div
      className={cn(style.back, { [style.click_disabled]: loading })}
      onClick={onBackClick}
    >
      {loading && <LoaderLinear />}
      <div className={style.wrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <GrClose
            className={style.closebtn}
            onClick={() => setEditMode(false)}
            size="30px"
          />
          <Input
            {...register('name')}
            placeholder="Name"
            label="Name:"
            error={errors.name?.message}
          />
          <Input
            {...register('fullName')}
            placeholder="Surname"
            label="Surname:"
            error={errors.fullName?.message}
          />
          <Input
            {...register('age')}
            placeholder="Age"
            label="Age:"
            error={errors.age?.message}
          />
          <Input
            {...register('status')}
            placeholder="Status"
            label="Status:"
            error={errors.status?.message}
          />
          <Input
            {...register('photoURL')}
            placeholder="Photo"
            label="Photo URL:"
            error={errors.photoURL?.message}
          />
          <Input
            {...register('location.country')}
            placeholder="Country"
            label="Country:"
            error={errors.location?.country?.message}
          />
          <Input
            {...register('location.city')}
            placeholder="City"
            label="City:"
            error={errors.location?.city?.message}
          />
          <div className={style.buttons}>
            <Button
              variant="danger"
              type="button"
              onClick={onReset}
              disabled={loading}
              className={style.button}
            >
              Clear
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!isValid || loading}
              className={style.button}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.querySelector('body') as HTMLElement,
  );
};
export default ChangeProfileForm;
