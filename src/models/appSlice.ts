import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {App, Page} from "@/models/app.ts"


const initialState = {}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setApp(state, action: PayloadAction<App>) {
            console.log("setApp", action.payload)
            return action.payload;
        },
        setPage(state, action: PayloadAction<Page>) {
            state.currentPage = action.payload;
        }
    }
})

export const {
    setApp,
    setPage
} = appSlice.actions;
export default appSlice.reducer