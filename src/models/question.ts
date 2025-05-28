import {stringify} from "querystring";
import {ChoiceType, ConfigurationType, PatternType, QuestionType, SelectorType, ValidationType} from "@/types.ts"
import {UpkQuestion} from "@/api/models/upk-question.ts"
import {UpkQuestionType} from "@/api";


export class ProfilingAnswer {
    // let values: Array<{ value: string }> = question_answer.values || []

    questionId: string;
    values: string[] = [];

    constructor(qid: string, values: string[]) {
        this.questionId = qid;
        this.values = values
    }
}

export class ProfilingQuestion implements UpkQuestion {
    questionId: string;  // It's a UUID
    countryIso: string;  // 2-letter lower
    languageIso: string;  // 3-letter lower

    questionType: UpkQuestionType;
    selector: SelectorType;
    questionText: string;  // "title" of the question

    choices?: ChoiceType[];

    extQuestionId?: any;
    configuration: ConfigurationType | null = null;
    validation: ValidationType | null = null;

    importance?: any;
    task_count: number;
    task_score: number;

    private _complete: boolean = false;
    private _processing: boolean = false;
    private _answer: ProfilingAnswer | null = null;

    error_msg: string = "";

    constructor(data) {
        this.questionId = data.question_id;
        this.countryIso = data.country_iso;
        this.languageIso = data.language_iso;

        this.questionType = data.question_type;
        this.selector = data.selector;
        this.questionText = data.question_text;

        this.choices = data.choices

        this.extQuestionId = data.ext_question_id;
        this.configuration = data.configuration;
        this.validation = data.validation;
    }

    // --- Properties ---

    getType(): QuestionType {
        return this.questionType as QuestionType
    }

    getSelector(): SelectorType {
        return this.selector as SelectorType
    }

    getChoices(): ChoiceType[] | null {
        const choices: ChoiceType[] = this.choices;
        if (choices.length > 0) {
            return choices;
        } else {
            return null;
        }
    }

    // --- Methods ---

    addAnswer(val: string): null {
        val = val.trim();

        switch (this.getType()) {

            case "TE":
                this._answer = new ProfilingAnswer(this.questionId, [val]);
                break

            case "MC":
                let current_values: string[] = this._answer?.values
                current_values.push(val)
                this._answer = new ProfilingAnswer(this.questionId, current_values);
                break

            default:
                throw new Error("Incorrect Question Type provided");
        }

        this.validate()
    }

    removeAnswer(val: string): null {
        switch (this.getType()) {

            // You can only remove a value from a MultiChoice
            case "MC":
                // TODO: implement this
                // let current_values: string[] = this._answer?.values
                // current_values.push(val)
                // this._answer = new ProfilingAnswer(this.questionId, current_values);
                break

            default:
                throw new Error("Incorrect Question Type provided");
        }

        this.validate()
    }

    validate(): boolean {
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

        if (this._answer == null) {
            this.error_msg = "An answer is required"
            return false
        }

        let qa: ProfilingAnswer = this._answer;

        switch (this.getType()) {
            case "TE":
                if (qa.values.length == 0) {
                    this.error_msg = "An answer is required"
                    return false
                }

                if (qa.values.length > 1) {
                    this.error_msg = "Only one answer allowed"
                    return false
                }

                let answer: string = qa.values[0]

                if (answer.length <= 0) {
                    this.error_msg = "Must provide answer"
                    return false
                }

                const max_length: number = (this.configuration ?? {})["max_length"] ?? 100000

                if (answer.length > max_length) {
                    this.error_msg = "Answer longer than allowed"
                    return false
                }

                const patterns: PatternType[] = (this.validation ?? {})["patterns"] ?? []

                patterns.forEach((pattern) => {
                    let re = new RegExp(pattern["pattern"])
                    if (answer.search(re) == -1) {
                        this.error_msg = pattern["message"]
                        return false
                    }
                })

                this.error_msg = ""
                return true

            case "MC":
                // if (qa.values.length == 0) {
                //     this.error_msg = "MC question with no selected answers"
                //     return false
                // }
                //
                // const choice_codes = map(this.getChoices().toJSON(), "choice_id")
                //
                // switch (this.getSelector()) {
                //     case "SA":
                //         if (qa.values.length > 1) {
                //             this.error_msg = "Single Answer MC question with >1 selected answers"
                //             return false
                //         }
                //         break
                //     case "MA":
                //         if (qa.values.length > choice_codes.length) {
                //             this.error_msg = "More options selected than allowed"
                //             return false
                //         }
                //         break
                // }
                //
                // if (!every(qa.values, (v) => {
                //     return includes(choice_codes, v["value"])
                // })) {
                //     this.error_msg = "Invalid Options Selected"
                //     return false
                // }
                //
                // const max_select: number = (this.configuration ?? {})["max_select"] ?? choice_codes.length
                // if (qa.values.length > max_select) {
                //     this.error_msg = "More options selected than allowed"
                //     return false
                // }

                /*
                exclusive_choice = next((x for x in question["choices"] if x.get("exclusive")), None)
                if exclusive_choice:
                    exclusive_choice_id = exclusive_choice["choice_id"]
                    assert answer == [exclusive_choice_id] or \
                           exclusive_choice_id not in answer, "Invalid exclusive selection"
                 */

                this.error_msg = ""
                return true

            default:
                throw new Error("Incorrect Question Type provided");
        }

    }

    // -- Database / Format --
    static fromJson(json: any): ProfilingQuestion {
        return new ProfilingQuestion(json);
    }

    save() {
        let question: ProfilingQuestion = this;
        // @ts-ignore
        let answer: ProfilingAnswer = question._answer;

        if (this._complete || this._processing) {
            return
        }
        this._processing = true

        let res = JSON.stringify({
            "answers": [{
                "question_id": answer.get('question_id'),
                "answer": map(answer.get("values"), "value")
            }]
        });

        $.ajax({
            url: ["https://fsb.generalresearch.com", questions.BPID, "profiling-questions", ""].join("/") + "?" + stringify({"bpuid": questions.BPUID}),
            xhrFields: {withCredentials: false},
            processData: false,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: res,
            success: function (data) {
                channel.trigger("ProfilingQuestions:start");
            },
            error: function (data) {
                channel.trigger("ProfilingQuestions:start");
                Sentry.captureMessage("Profiling Question submission failed.");
            }
        });
    }

}