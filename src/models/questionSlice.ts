import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {UpkQuestion} from "@/api";
import {Answer} from "@/models/answerSlice.ts";
import {assert} from "@/lib/utils.ts"
import {Selector} from "react-redux";

export interface ProfileQuestion extends UpkQuestion {
    active: false
}

const initialState: ProfileQuestion[] = []

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // setQuestions(state, action: PayloadAction<ProfileQuestion[]>) {
        //     return action.payload;
        // },
        setQuestions(state, action: PayloadAction<ProfileQuestion[]>) {
            const existingIds = new Set(state.map(q => q.question_id));
            const newQuestions = action.payload.filter(q => !existingIds.has(q.question_id));
            state.push(...newQuestions);
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
export const makeSelectQuestionsByIds = (ids: string[]) =>
    createSelector(
        (state: RootState) => state.questions,
        (questions: ProfileQuestion[]) => questions.filter(q => ids.includes(q.question_id))
    )

export const selectActiveQuestion = (state: RootState) => state.questions.find(i => i.active)
export const selectAnswers = (state: RootState) => state.answers

export const selectFirstAvailableQuestion = createSelector(
    [selectQuestions, selectAnswers],
    (questions, answers): Selector<RootState, ProfileQuestion | null> => {
        /*  This is used when the app loads up the Questions page and we
            need to find the first Question that we'll present to
            the Respondent.

            If there are any questions marked as active, show that
            first. However, if there are not.. go ahead and search for
            the next Question without an Answer or an Answer that isn't complete
         */

        const active = questions.find(q => q.active)
        if (active) {
            return active
        }

        let res = questions.filter(q => {
            const a: Answer | undefined = answers[q.question_id]
            return !a || !a.complete
        })


        return res[0] || null
    }
)

export const selectNextAvailableQuestion = createSelector(
    [selectQuestions, selectAnswers],
    (questions, answers): Selector<RootState, ProfileQuestion | null> => {
        /*  This takes the current active position and finds the next available
            question to answer.

            Check if there are any questions marked as active. If there are not,
            the Questions page didn't load yet and/or we don't know what the Respondent
            is currently looking at... so we can't determine what is next. Immediately fail.
         */
        const active = questions.find(q => q.active)
        assert(active, "Must have an active Question")
        const active_index = questions.findIndex(q => q.question_id === active.question_id)

        // Find any Questions without Answers, or Answers that are not complete
        // that are positioned after the currently active Question
        let found = questions.find((q, q_idx) => {
            const a: Answer | undefined = answers[q.question_id]
            return q_idx > active_index && (!a || !a.complete)
        })

        if (!found) {
            // No eligible questions were found after the current active position, so
            // go back and look for any before the current active position.
            found = questions.find((q, q_idx) => {
                const a: Answer | undefined = answers[q.question_id]
                return q_idx < active_index && (!a || !a.complete)
            })
        }

        return found || null
    }
)
