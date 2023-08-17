import { useSelector, TypedUseSelectorHook } from 'react-redux';

import { RootStateType } from 'store/createStore';


export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
