import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '@/store'
import {selectQuestionById} from "@/models/questionSlice.ts"
// import {Answer} from "@/models/answer.ts";
// import {stringify} from "querystring";
// import {PatternType} from "@/types.ts";

// import { enableMapSet } from 'immer'
// enableMapSet()

// const initialState = new Map<string, Answer>();
const initialState = {};

const answerSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        addAnswer(state, action: PayloadAction<{questionId: string, val: string}>) {
            let question = selectQuestionById(state, action.payload.questionId)
            let val = action.payload.val.trim();

            console.log("addAnswer:", question, val)

            // switch (question.questionType) {
            //     case "TE":
            //         let answer: Answer = {
            //             questionId: question.questionId,
            //             values: [val]
            //         } as Answer
            //
            //         break
            //         // return {question.questionId: answer}
            //
            //     case "MC":
            //         let answer = selectAnswerByQuestionId(questionId)
            //
            //         if (answer) {
            //             let current_values: string[] = answer.values
            //         } else {
            //             let current_values: string[] = []
            //         }
            //
            //         current_values.push(val)
            //         let new_answer = new Anwer(question.questionId, val);
            //
            //         return {question.questionId: new_answer}
            //
            //     default:
            //         throw new Error("Incorrect Question Type provided");
            // }

            // this.validate()
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

        // removeAnswer(val: string): null {
        //     switch (this.getType()) {
        //
        //         // You can only remove a value from a MultiChoice
        //         case "MC":
        //             // TODO: implement this
        //             // let current_values: string[] = this._answer?.values
        //             // current_values.push(val)
        //             // this._answer = new ProfilingAnswer(this.questionId, current_values);
        //             break
        //
        //         default:
        //             throw new Error("Incorrect Question Type provided");
        //     }
        //
        //     this.validate()
        // }


        // validate(): boolean {
        //     /*
        //     If the question is MC, validate:
        //     - validate selector SA vs MA (1 selected vs >1 selected)
        //     - the answers match actual codes in the choices
        //     - validate configuration.max_select
        //     - validate choices.exclusive
        //
        //     If the question is TE, validate that:
        //         - configuration.max_length
        //         - validation.patterns
        //     */
        //
        //     if (this._answer == null) {
        //         this.error_msg = "An answer is required"
        //         return false
        //     }
        //
        //     let qa: ProfilingAnswer = this._answer;
        //
        //     switch (this.getType()) {
        //         case "TE":
        //             if (qa.values.length == 0) {
        //                 this.error_msg = "An answer is required"
        //                 return false
        //             }
        //
        //             if (qa.values.length > 1) {
        //                 this.error_msg = "Only one answer allowed"
        //                 return false
        //             }
        //
        //             let answer: string = qa.values[0]
        //
        //             if (answer.length <= 0) {
        //                 this.error_msg = "Must provide answer"
        //                 return false
        //             }
        //
        //             const max_length: number = (this.configuration ?? {})["max_length"] ?? 100000
        //
        //             if (answer.length > max_length) {
        //                 this.error_msg = "Answer longer than allowed"
        //                 return false
        //             }
        //
        //             const patterns: PatternType[] = (this.validation ?? {})["patterns"] ?? []
        //
        //             patterns.forEach((pattern) => {
        //                 let re = new RegExp(pattern["pattern"])
        //                 if (answer.search(re) == -1) {
        //                     this.error_msg = pattern["message"]
        //                     return false
        //                 }
        //             })
        //
        //             this.error_msg = ""
        //             return true
        //
        //         case "MC":
        //             // if (qa.values.length == 0) {
        //             //     this.error_msg = "MC question with no selected answers"
        //             //     return false
        //             // }
        //             //
        //             // const choice_codes = map(this.getChoices().toJSON(), "choice_id")
        //             //
        //             // switch (this.getSelector()) {
        //             //     case "SA":
        //             //         if (qa.values.length > 1) {
        //             //             this.error_msg = "Single Answer MC question with >1 selected answers"
        //             //             return false
        //             //         }
        //             //         break
        //             //     case "MA":
        //             //         if (qa.values.length > choice_codes.length) {
        //             //             this.error_msg = "More options selected than allowed"
        //             //             return false
        //             //         }
        //             //         break
        //             // }
        //             //
        //             // if (!every(qa.values, (v) => {
        //             //     return includes(choice_codes, v["value"])
        //             // })) {
        //             //     this.error_msg = "Invalid Options Selected"
        //             //     return false
        //             // }
        //             //
        //             // const max_select: number = (this.configuration ?? {})["max_select"] ?? choice_codes.length
        //             // if (qa.values.length > max_select) {
        //             //     this.error_msg = "More options selected than allowed"
        //             //     return false
        //             // }
        //
        //             /*
        //             exclusive_choice = next((x for x in question["choices"] if x.get("exclusive")), None)
        //             if exclusive_choice:
        //                 exclusive_choice_id = exclusive_choice["choice_id"]
        //                 assert answer == [exclusive_choice_id] or \
        //                        exclusive_choice_id not in answer, "Invalid exclusive selection"
        //              */
        //
        //             this.error_msg = ""
        //             return true
        //
        //         default:
        //             throw new Error("Incorrect Question Type provided");
        //     }
        //
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

// Export the generated reducer function
export const {setAnswer, setQuestions, questionAdded, questionUpdated} = answerSlice.actions;
export default answerSlice.reducer

export const selectAnswerCount = (state: RootState) => state.answers.size
// export const selectAnswerByQuestionId = (state: RootState, questionId: string) => state.answers.find(a => q.questionId === questionId)