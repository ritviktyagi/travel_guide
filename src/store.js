import { configureStore } from '@reduxjs/toolkit';
import mapSlice from './mapSlice';

export const store = configureStore({
    reducer: {
        map: mapSlice,
    }
})