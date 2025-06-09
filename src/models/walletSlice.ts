import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import {UserWalletBalance} from "@/api";


const initialState: UserWalletBalance = {} as UserWalletBalance;


const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWallet(state, action: PayloadAction<UserWalletBalance>) {
            return action.payload;
        }
    }
})

export const {
    setWallet,
} = walletSlice.actions;
export default walletSlice.reducer

