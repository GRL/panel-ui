import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
// import {Answer} from "@/models/answer.ts";
// import {stringify} from "querystring";
import {RootState} from '@/store'; // your root state type
import {PatternValidation, UpkQuestion} from "@/api";

interface Answer {
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

        addAnswer(state, action: PayloadAction<{ question: UpkQuestion, val: string }>) {
            let question: UpkQuestion = action.payload.question;
            let val: string = action.payload.val.trim();
            let answer: Answer = state[question.question_id] ?? {
                values: [],
                error_msg: "",
                complete: false,
                processing: false
            } as Answer;

            /*
            If the question is MC, validate:
            - validate selector SA vs MA (1 selected vs >1 selected)
            - the answers match actual codes in the choices
            - validate configuration.max_select
            - validate choices.exclusive

            If the question is TE, validate that:
                - configuration.max_length
                - validation.patterns
            */

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

                    answer.error_msg = ""
                    break;

                case "MC":
                    switch (question.selector) {
                        case "SA": // Single Answer
                            answer.values = [val]
                            break
                        case "MA": /// Multi Answer
                            if (answer.values.includes(val)) {
                                // The item has already been selected
                                answer.values = answer.values.filter(value => value !== val);
                            } else {
                                // It's a new selection
                                answer.values.push(val);
                            }
                            break
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

        // removeAnswer(val: string): null {
        //     switch (this.getType()) {
        //         // You can only remove a value from a MultiChoice
        //         case "MC":
        //             // TODO: implement this
        //             // let current_values: string[] = this._answer?.values
        //             // current_values.push(val)
        //             // this._answer = new ProfilingAnswer(this.questionId, current_values);
        //             break
        //         default:
        //             throw new Error("Incorrect Question Type provided");
        //     }
        //     this.validate()
        // }

        // save() {
        //     let question: ProfilingQuestion = this;
        //     // @ts-ignore
        //     let answer: ProfilingAnswer = question._answer;
        //
        //     if (this._complete || this._processing) {
        //         return
        //     }
        //     this._processing = true
        //
        //     let res = JSON.stringify({
        //         "answers": [{
        //             "question_id": answer.get('question_id'),
        //             "answer": map(answer.get("values"), "value")
        //         }]
        //     });
        //
        //     $.ajax({
        //         url: ["https://fsb.generalresearch.com", questions.BPID, "profiling-questions", ""].join("/") + "?" + stringify({"bpuid": questions.BPUID}),
        //         xhrFields: {withCredentials: false},
        //         processData: false,
        //         type: "POST",
        //         contentType: "application/json; charset=utf-8",
        //         data: res,
        //         success: function (data) {
        //             channel.trigger("ProfilingQuestions:start");
        //         },
        //         error: function (data) {
        //             channel.trigger("ProfilingQuestions:start");
        //             Sentry.captureMessage("Profiling Question submission failed.");
        //         }
        //     });
        // }


    }
})

export const {addAnswer, setAnswer, setQuestions, questionAdded, questionUpdated} = answerSlice.actions;
export default answerSlice.reducer


export const makeSelectChoicesByQuestion = (question: UpkQuestion) =>
    createSelector(
        (state: RootState) => state.answers,
        (answers) => {
            // const question = questions.find(q => q.id === questionId);
            // return question?.choices ?? [];
            return answers[question.question_id] ?? {
                values: [],
                error_msg: "",
                complete: false,
                processing: false
            } as Answer;
        }
    );