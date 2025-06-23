import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {QuestionInfo} from "@/api";


const initialState: QuestionInfo[] = []

const upkQuestionSlice = createSlice({
    name: 'upkQuestions',
    initialState,
    reducers: {
        setUpkQuestions(state, action: PayloadAction<QuestionInfo[]>) {
            console.log("setUpkQuestions:", state)
            const existingIds = new Set(state.map(q => q.property_id));
            const newQuestions = action.payload.filter(q => !existingIds.has(q.property_id));
            state.push(...newQuestions);
        },
    }
})

export const {
    setUpkQuestions,
} = upkQuestionSlice.actions;
export default upkQuestionSlice.reducer