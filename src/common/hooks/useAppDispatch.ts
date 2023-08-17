import { useDispatch } from 'react-redux';

import { AppDispatchType } from '../../store/createStore';

export const useAppDispatch: () => AppDispatchType = useDispatch;
