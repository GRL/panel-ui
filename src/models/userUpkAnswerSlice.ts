import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserProfileKnowledge} from "@/api";
import type {RootState} from "@/store.ts";

const initialState: UserProfileKnowledge[] = []

const userUpkAnswerSlice = createSlice({
    name: 'upkAnswers',
    initialState,
    reducers: {
        setUpkAnswers(state, action: PayloadAction<UserProfileKnowledge[]>) {
            const existingIds = new Set(state.map(q => q.property_id));
            const newQuestions = action.payload.filter(q => !existingIds.has(q.property_id));
            state.push(...newQuestions);
        }
    }
})


export const {
    setUpkAnswers,
} = userUpkAnswerSlice.actions;

export default userUpkAnswerSlice.reducer;

export const selectUserUpkAnswers = (state: RootState) => state.userUpkAnswers


// educational_attainment
export const selectUserAge = (state: RootState): number | null => {
    let upk_a = state.userUpkAnswers.find(a => a.property_label === "age_in_years")
    if (upk_a) {
        return Number(upk_a.answer[0].value)
    } else {
        return null
    }
}
export const selectUserZip = (state: RootState): string | null => {
    let upk_a = state.userUpkAnswers.find(a => a.property_label === "home_postal_code")
    if (upk_a) {
        return upk_a.answer[0].value
    } else {
        return null
    }
}

export const selectUserGender = (state: RootState): string | null => {
    let upk_a = state.userUpkAnswers.find(a => a.property_label === "gender")
    if (upk_a) {
        return upk_a.answer[0].label
    } else {
        return null
    }
}