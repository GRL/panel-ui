import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserProfile} from "@/api";

const initialState: UserProfile = {} as UserProfile


const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUserProfile(state, action: PayloadAction<UserProfile>) {
            return action.payload
        }
    }
})

export const {
    setUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
