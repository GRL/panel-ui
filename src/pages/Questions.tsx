import React from 'react'
import {UpkQuestion} from "@/api";
import {UpkQuestionChoice} from "@/api/models/upk-question-choice.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useAppSelector} from "@/hooks.ts";

const TextEntry: React.FC<{ question: UpkQuestion }> = ({question}) => {
    // const dispatch = useAppDispatch()
    // const buckets = useAppSelector(state => state.buckets)

    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     // Don't allow any input changes after they triggered submission...
    //     if (question._complete || question._processing) {
    //         return
    //     }
    //
    //     // Assign the input value as an answer to the question
    //     const newValue = event.target.value;
    //     dispatch(setAnswer({questionId: question.questionId, val: newValue}))
    // };

    return (
        <Card className="@container/card">
            <CardHeader>
                {question.question_text}
            </CardHeader>

            <CardContent>
                <input type="text"
                       id="text-entry-input"
                       aria-describedby=""
                       placeholder=""
                    // onInput={handleInputChange}
                />
                {/*<small id="text-entry-msg">{question.error_msg}</small>*/}
            </CardContent>
        </Card>
    )
}

const MultiChoiceItem: React.FC<{ question: UpkQuestion, choice: UpkQuestionChoice }> = ({question, choice}) => {

    // const onclick = function () {
    //     // Assign the input value as an answer to the question
    //     let answer = getAnswer;
    //     let click_value = childView.model.get("choice_id")
    //
    //     switch (question.selector) {
    //
    //         case "SA": /// Single Answer
    //             answer.set("values", [{"value": click_value}]);
    //             break
    //
    //         case "MA": /// Multi Answer
    //             let current_values: AnswerValueItemType[] = answer.get("values") ?? [];
    //
    //             if (includes(map(current_values, "value"), click_value)) {
    //                 // The item has already been selected
    //                 current_values = remove(current_values, (v) => {
    //                     return v["value"] != click_value
    //                 })
    //
    //             } else {
    //                 // It's a new selection
    //                 current_values.push({"value": click_value})
    //             }
    //
    //             answer.set("values", current_values);
    //             break
    //     }
    //     childView.render();
    //
    //     // Validate the answer and show any information
    //     let res: QuestionValidationResult = this.model.validateAnswer()
    //     this.ui.message.text(res["message"]);
    // }

    // const render = function () {
    //     let answer = this.getOption("answer");
    //     let current_values: AnswerValueItemType[] = answer.get("values") ?? [];
    //     let current_values_values = map(current_values, "value");
    //
    //     if (includes(current_values_values, this.model.get("choice_id"))) {
    //         this.$el.addClass("selected");
    //     }
    // }

    return (
        <>
            {choice.choice_text}
        </>
    )
}

const MultipleChoice: React.FC<{ question: UpkQuestion }> = ({question}) => {

    return (
        <Card>
            <CardHeader>
                {question.question_text}
                {/*<small id="text-entry-msg">{question.error_msg}</small>*/}
            </CardHeader>

            <CardContent>
                {
                    question.choices.map(c => {
                        return <MultiChoiceItem key={`${question.question_id}-${c.choice_id}`} question={question} choice={c}/>
                    })
                }
            </CardContent>
        </Card>
    )
}


const ProfileQuestionFull: React.FC<UpkQuestion> = ({question}) => {
    switch (question.question_type) {
        case "TE":
            return <TextEntry question={question}/>

        case "MC":
            return <MultipleChoice question={question}/>

        default:
            throw new Error("Incorrect Question Type provided");
    }
}

const QuestionsPage = () => {
    const questions = useAppSelector(state => state.questions)

    return (
        <div>
            <p>
                A total of {questions.length} questions are available.
            </p>

            {
                questions.map(q => {
                    return <ProfileQuestionFull key={q.question_id} question={q} className="mt-4 mb-4"/>;
                })
            }
        </div>
    );
}

export {
    QuestionsPage
}