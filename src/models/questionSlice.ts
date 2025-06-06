import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {UpkQuestion} from "@/api";
import {Answer} from "@/models/answerSlice.ts";

export interface ProfileQuestion extends UpkQuestion {
    active: false
}

const initialState: ProfileQuestion[] = []

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestions(state, action: PayloadAction<ProfileQuestion[]>) {
            return action.payload;
        },
        questionAdded(state, action: PayloadAction<ProfileQuestion>) {
            state.push(action.payload);
        },
        setNextQuestion(state) {
            const item = state.find((i) => i.active)

            const index = state.findIndex(q => q.question_id === item.question_id)
            const nextQuestion = index !== -1 ? state[index + 1] ?? null : null

            state.forEach((q) => {
                q.active = q.question_id === nextQuestion.question_id
            })

        },
        setQuestionActive(state, action: PayloadAction<ProfileQuestion>) {
            state.forEach((q) => {
                q.active = q.question_id === action.payload.question_id
            })
        },
        updateQuestion(state, action: PayloadAction<{ question_id: string, updates: Partial<ProfileQuestion> }>) {
            const item = state.find((i) => i.question_id === action.payload.question_id)
            if (item) {
                Object.assign(item, action.payload.updates)
            }
        }
    }
})

export const {
    setQuestions,
    setQuestionActive,
    setNextQuestion,
    questionAdded,
    updateQuestion
} = questionSlice.actions;
export default questionSlice.reducer

// We need to fetch the next available Question that either doesn't have an Answer, or the Answer
// isn't Answer.completed
export const selectQuestions = (state: RootState) => state.questions
export const selectActiveQuestion = (state: RootState) => state.questions.find(i => i.active)
export const selectAnswers = (state: RootState) => state.answers

export const selectNextAvailableQuestion = createSelector(
    [selectQuestions, selectAnswers],
    (questions, answers) => {

        // -- Check if there are any questions marked as active
        const active = questions.find(q => q.active)
        if (active) {
            return active
        }

        let res = questions.filter(q => {
            const a: Answer | undefined = answers[q.question_id]
            return !a || a.complete === false
        })

        // return res.reduce((min, q) =>
        //         !min || q.order < min.order ? q : min,
        //     null as typeof res[0] | null
        // )

        return res[0] || null
    }
)


export const selectQuestionById = (questionId: string) =>
    createSelector(
        (state: RootState) => state.questions,
        (questions) => {
            return questions.find(q => q.question_id === questionId);
        }
    );