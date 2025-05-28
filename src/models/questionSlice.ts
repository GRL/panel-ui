import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {UpkQuestion} from "@/api/models/upk-question.ts"

const initialState: UpkQuestion[] = []

// Create the slice and pass in the initial state
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
        setAnswer(state, action: PayloadAction<{ questionId: string, val: string }>) {
            const {questionId, val} = action.payload
            console.log(questionId, val)
            const existingQuestion = state.find(q => q.questionId === action.payload.questionId)
            if (existingQuestion) {
                // existingQuestion.addAnswer(action.payload.val)
                // existingQuestion.error_msg = "yess"
            }
        }
    }
})

// Export the generated reducer function
export const {setAnswer, setQuestions, questionAdded, questionUpdated} = questionSlice.actions;
export default questionSlice.reducer

export const selectAllQuestions = (state: RootState) => state.questions

export const selectQuestionById = (state: RootState, questionId: string) => state.questions.find(q => q.id === questionId)