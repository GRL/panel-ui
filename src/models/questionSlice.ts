import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {UpkQuestion} from "@/api";

const initialState: UpkQuestion[] = []

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestions(state, action: PayloadAction<UpkQuestion[]>) {
            return action.payload;
        },
        questionAdded(state, action: PayloadAction<UpkQuestion>) {
            state.push(action.payload);
        },
    }
})

export const {setAnswer, setQuestions, questionAdded, questionUpdated} = questionSlice.actions;
export default questionSlice.reducer

// export const selectAllQuestions = (state: RootState) => state.questions

export const selectQuestionById = (questionId: string) =>
    createSelector(
        (state: RootState) => state.questions,
        (questions) => {
            return questions.find(q => q.question_id === questionId);
        }
    );