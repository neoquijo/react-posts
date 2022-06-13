import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { postsApi } from './postApi';
import postSlice from './postSlice';

export const store = configureStore({
  reducer: {
    search: postSlice,
    [postsApi.reducerPath]: postsApi.reducer
  },
  middleware: dm => dm().concat(postsApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
