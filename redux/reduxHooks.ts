import {
  TypedUseSelectorHook,
  useDispatch as ogDispatch,
  useSelector as ogSelector,
} from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useDispatch = () => ogDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = ogSelector;
