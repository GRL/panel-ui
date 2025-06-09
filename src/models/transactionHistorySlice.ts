import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserTransactionRow} from "@/api";
import type {RootState} from "@/store.ts";


const initialState: UserTransactionRow[] = []

const transactionHistorySlice = createSlice({
    name: 'transactionHistory',
    initialState,
    reducers: {
        setBuckets(state, action: PayloadAction<UserTransactionRow[]>) {
            return action.payload;
        },
        transactionAdded(state, action: PayloadAction<UserTransactionRow>) {
            state.push(action.payload);
        }
    }
})

export const {setBuckets, bucketAdded} = transactionHistorySlice.actions;
export default transactionHistorySlice.reducer

export const selectTransactionHistory = (state: RootState) => state.transactionHistory
