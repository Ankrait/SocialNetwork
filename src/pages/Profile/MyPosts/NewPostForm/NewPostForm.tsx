import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../../../common/hooks';
import {
  addPost,
  postsActionStatusEnum,
} from '../../../../store/reducers/profileSlice';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';

import style from './NewPostForm.module.css';
import LoaderCircular from 'components/LoaderCircular/LoaderCircular';

type NewPostDataType = {
  message: string;
  img_link: string;
};

const schema = yup.object({
  message: yup.string().trim().max(300, 'Max 300 symbols'),
  img_link: yup.string().trim().max(300, 'Max 300 symbols'),
});

const NewPostForm: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authID = useAppSelector(state => state.auth.userID)!;
  const { postsActionStatus } = useAppSelector(state => state.profile);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    reset,
  } = useForm<NewPostDataType>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: NewPostDataType): Promise<void> => {
    const actionResult = await dispatch(addPost({ ...data, userID: authID }));

    if (addPost.fulfilled.match(actionResult)) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      <Input
        {...register('message')}
        placeholder="Your news..."
        error={errors.message?.message}
      />
      <Input
        {...register('img_link')}
        placeholder="Image link..."
        error={errors.img_link?.message}
      />
      <div className={style.form_footer}>
        {postsActionStatus === postsActionStatusEnum.Adding && (
          <LoaderCircular />
        )}
        <Button
          variant={'primary'}
          disabled={
            !isValid || postsActionStatus === postsActionStatusEnum.Adding
          }
          type="submit"
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default NewPostForm;
