import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {QuestionInfo} from "@/api";


const initialState: QuestionInfo[] = []

const upkQuestionSlice = createSlice({
    name: 'upkQuestions',
    initialState,
    reducers: {
        setUpkQuestions(state, action: PayloadAction<QuestionInfo[]>) {
            const existingIds = new Set(state.map(q => q.question_id));
            const newQuestions = action.payload.filter(q => !existingIds.has(q.property_id));
            state.push(...newQuestions);
        },
    }
})

export const {
    setUpkQuestions,
} = upkQuestionSlice.actions;
export default upkQuestionSlice.reducer

// We need to fetch the next available Question that either doesn't have an Answer, or the Answer
// isn't Answer.completed
export const selectUpkQuestions = (state: RootState) => state.questions