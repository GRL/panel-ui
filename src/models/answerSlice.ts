import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Selector} from 'react-redux'

// import {Answer} from "@/models/answer.ts";
// import {stringify} from "querystring";
import {RootState} from '@/store'; // your root state type
import {PatternValidation} from "@/api";
import {assert} from "@/lib/utils.ts"
import {ProfileQuestion} from "@/models/questionSlice.ts"

export interface Answer {
    values: string[];
    error_msg: string;

    complete: boolean;
    processing: boolean;
}

type AnswersState = {
    [id: string]: Answer;
};

const initialState: AnswersState = {};


const answerSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        addAnswer(state, action: PayloadAction<{ question: ProfileQuestion, val: string }>) {
            /* If the question is MC, validate:
                - validate selector SA vs MA (1 selected vs >1 selected)
                - the answers match actual codes in the choices
                - validate configuration.max_select
                - validate choices.exclusive

                If the question is TE, validate that:
                    - configuration.max_length
                    - validation.patterns
            */
            let question: ProfileQuestion = action.payload.question;
            let val: string = action.payload.val.trim();
            let answer: Answer = state[question.question_id] ?? {
                values: [],
                error_msg: "",
                complete: false,
                processing: false
            } as Answer;

            answer.error_msg = ""  // Reset any error messages

            switch (question.question_type) {
                case "TE":
                    answer.values = [val]

                    if (answer.values.length > 1) {
                        answer.error_msg = "Only one answer allowed"
                        break;
                    }

                    let answer_text: string = answer.values[0]

                    if (answer_text.length <= 0) {
                        answer.error_msg = "Must provide answer"
                        break;
                    }

                    const max_length: number = (question.configuration ?? {})["max_length"] ?? 100000

                    if (answer_text.length > max_length) {
                        answer.error_msg = "Answer longer than allowed"
                        break;
                    }

                    const patterns: PatternValidation[] = (question.validation ?? {})["patterns"] ?? []
                    patterns.forEach((pv) => {
                        let re = new RegExp(pv.pattern)
                        if (answer_text.search(re) == -1) {
                            answer.error_msg = pv.message
                            return;
                        }
                    })

                    break;

                case "MC":
                    if (answer.values.includes(val)) {
                        // The item has already been selected
                        answer.values = answer.values.filter(value => value !== val);

                    } else {
                        // It's a new selection
                        if (question.selector == "SA") {
                            answer.values = [val]
                        } else if (question.selector == "MA") {
                            answer.values.push(val);
                        }
                    }

                    if (answer.values.length == 0) {
                        answer.error_msg = "MC question with no selected answers"
                    }

                    const choice_codes: string[] = question.choices?.map((c) => c.choice_id) ?? [];

                    switch (question.selector) {
                        case "SA":
                            if (answer.values.length > 1) {
                                answer.error_msg = "Single Answer MC question with >1 selected answers"
                            }
                            break;
                        case "MA":
                            if (answer.values.length > choice_codes.length) {
                                answer.error_msg = "More options selected than allowed"
                            }
                            break;
                    }


                    if (!answer.values.every(val => choice_codes.includes(val))) {
                        answer.error_msg = "Invalid Options Selected";
                    }

                    const max_select: number = (question.configuration ?? {})["max_select"] ?? choice_codes.length
                    if (answer.values.length > max_select) {
                        answer.error_msg = "More options selected than allowed"
                    }

                    /*
                    exclusive_choice = next((x for x in question["choices"] if x.get("exclusive")), None)
                    if exclusive_choice:
                        exclusive_choice_id = exclusive_choice["choice_id"]
                        assert answer == [exclusive_choice_id] or \
                               exclusive_choice_id not in answer, "Invalid exclusive selection"
                     */

                    answer.error_msg = ""
                    break;

                default:
                    throw new Error("Incorrect Question Type provided");
            }

            state[question.question_id] = answer
        },

        submitAnswer(state, action: PayloadAction<{ question: ProfileQuestion }>) {
            const question: ProfileQuestion = action.payload.question;
            const answer: Answer = state[question.question_id]

            assert(!answer.complete, "Can't submit completed Answer")
            assert(!answer.processing, "Can't submit processing Answer")
            assert(answer.error_msg.length == 0, "Can't submit Answer with error message")

            state[question.question_id] = {
                'values': answer.values,
                'error_msg': answer.error_msg,
                'processing': true,
                'complete': false
            } as Answer
        },

        saveAnswer(state, action: PayloadAction<{ question: ProfileQuestion }>) {
            const question: ProfileQuestion = action.payload.question;
            const answer: Answer = state[question.question_id]

            assert(!answer.complete, "Can't submit completed Answer")
            assert(answer.processing, "Answer must be processing")
            console.assert(answer.error_msg.length == 0, "Can't submit Answer with error message")

            state[question.question_id] = {
                'values': answer.values,
                'error_msg': answer.error_msg,
                'processing': false,
                'complete': true
            } as Answer
        }
    }
})

export const {
    addAnswer,
    saveAnswer,
    submitAnswer
} = answerSlice.actions;
export default answerSlice.reducer


export const selectAnswerForQuestion = (
    question: ProfileQuestion
): Selector<RootState, Answer | null> =>
    createSelector(
        (state: RootState) => state.answers,
        (answers) => {
            return answers[question.question_id] || null
        }
    );