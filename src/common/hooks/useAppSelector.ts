import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

import type { RootStateType } from '../../store/createStore';

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;