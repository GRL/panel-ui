import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {TaskStatusResponseOut} from "@/api";
import type {RootState} from "@/store.ts";


const initialState: TaskStatusResponseOut[] = []

const transactionHistorySlice = createSlice({
    name: 'taskStatus',
    initialState,
    reducers: {
        setTaskStatuses(state, action: PayloadAction<TaskStatusResponseOut[]>) {
            return action.payload;
        },
        // taskStatusAdd(state, action: PayloadAction<TaskStatusResponseOut>) {
        //     state.push(action.payload);
        // }
    }
})

export const {setTaskStatuses} = transactionHistorySlice.actions;
export default transactionHistorySlice.reducer

export const selectTransactionHistory = (state: RootState) => state.taskStatus
