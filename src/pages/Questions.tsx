import React, {useMemo, useState} from 'react'
import {UpkQuestion, UpkQuestionChoice} from "@/api";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {addAnswer, makeSelectChoicesByQuestion} from "@/models/answerSlice.ts";
import {selectQuestionById} from "@/models/questionSlice.ts";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination"

const TextEntry: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer = useSelector(selectAnswer);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(addAnswer({question: question, val: event.target.value}))
    };

    console.log("TextEntry.answer", answer)

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
                       onKeyDown={handleInputChange}
                />
                <small id="text-entry-msg">{answer.error_msg}</small>
            </CardContent>
        </Card>
    )
}

const MultiChoiceItem: React.FC<{ question: UpkQuestion, choice: UpkQuestionChoice }> = ({question, choice}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer = useSelector(selectAnswer);
    const selected = answer.values.includes(choice.choice_id)

    return (
        <Button
            onClick={() => dispatch(addAnswer({question: question, val: choice.choice_id}))}
            variant={selected ? "default" : "secondary"}
        >
            {choice.choice_text}
        </Button>
    )
}

const MultipleChoice: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer = useSelector(selectAnswer);

    return (
        <Card>
            <CardHeader>
                {question.question_text}
                <small id="text-entry-msg">{answer.error_msg}</small>
            </CardHeader>

            <CardContent>
                <ol>
                    {
                        question.choices.map(c => {
                            return <MultiChoiceItem
                                key={`${question.question_id}-${c.choice_id}`}
                                question={question}
                                choice={c}/>
                        })
                    }
                </ol>
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
    const [activeQuestionID, setQuestionID] = useState(() => questions[0].question_id);

    const selectQuestion = useMemo(() => selectQuestionById(activeQuestionID), [questions]);
    const question = useSelector(selectQuestion);

    console.log(activeQuestionID, questions)

    return (
        <div>
            <p>
                A total of {questions.length} questions are available.
            </p>

            <Pagination>
                <PaginationContent>
                    {
                        questions.map((q, i) => {
                            return (
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => setQuestionID(q.question_id)}
                                    >
                                        {i+1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }

                    <PaginationItem>
                        <PaginationNext/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


            <ProfileQuestionFull key={question.question_id} question={question} className="mt-4 mb-4"/>
        </div>
    );
}

export {
    QuestionsPage
}