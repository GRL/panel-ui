import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserProfileKnowledge} from "@/api";

const upkInitialState: UserProfileKnowledge[] = []

const upkAnswerSlice = createSlice({
    name: 'upkAnswers',
    upkInitialState,
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
} = upkAnswerSlice.actions;

export default upkAnswerSlice.reducer;