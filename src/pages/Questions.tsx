import React, {useEffect, useState} from 'react'

import {ProfilingQuestionsApi, UpkQuestionResponse} from "@/api"
import {ProfilingQuestion} from "@/models/question.ts";
import {setAnswer} from "@/models/questionSlice.ts"
import {UpkQuestion} from "@/api/models/upk-question.ts"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";


const TextEntry: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const dispatch = useAppDispatch()
    // const buckets = useAppSelector(state => state.buckets)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Don't allow any input changes after they triggered submission...
        if (question._complete || question._processing) {
            return
        }

        // Assign the input value as an answer to the question
        const newValue = event.target.value;
        dispatch(setAnswer({questionId: question.questionId, val: newValue}))
    };

    return (
        <Card className="@container/card">
            <CardHeader>
                {question.questionText}
            </CardHeader>

            <CardContent>
                <input type="text"
                       id="text-entry-input"
                       aria-describedby=""
                       placeholder=""
                       onInput={handleInputChange}
                />
                <small id="text-entry-msg">{question.error_msg}</small>
            </CardContent>
        </Card>
    )
}

const MultipleChoice: React.FC<{ question: UpkQuestion }> = ({question}) => {

    return (
        <Card>
            <CardHeader>
                {question.questionText}
            </CardHeader>

            <CardContent>
                <p>MultipleChoice ... </p>
            </CardContent>
        </Card>
    )
}


const ProfileQuestionFull: React.FC<{ question: UpkQuestion }> = ({question}) => {
    console.log("ProfileQuestionFull", question, question)

    switch (question.questionType) {
        case "TE":
            return <TextEntry question={question}/>

        case "MC":
            return <MultipleChoice question={question}/>

        default:
            throw new Error("Incorrect Question Type provided");
    }
}

const ProfileQuestionPreview: React.FC<{ question: UpkQuestion }> = ({question}) => {

    return (
        <div>
            {question.questionText}
        </div>
    )
};

const QuestionsPage = () => {
    const questions = useAppSelector(state => state.questions)

    return (
        <div>
            <p>
                A total of {questions.length} questions are available.
            </p>

            {
                questions.forEach(q => {
                    return <ProfileQuestionFull key={q.questionId} question={q} className="mt-4 mb-4"/>;
                })
            }
        </div>
    );
}

export {
    QuestionsPage
}