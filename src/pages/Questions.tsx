import React, {useMemo, useState} from 'react'
import {UpkQuestion, UpkQuestionChoice} from "@/api";
import {Card, CardContent, CardTitle, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import {addAnswer, makeSelectChoicesByQuestion} from "@/models/answerSlice.ts";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"

const TextEntry: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer = useSelector(selectAnswer);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(addAnswer({question: question, val: event.target.value}))
    };

    // console.log("TextEntry.answer", answer)

    return (
        <Input type="text"
               id="text-entry-input"
               aria-describedby=""
               placeholder=""
               onKeyDown={handleInputChange}
        />
        // <small id="text-entry-msg">{answer.error_msg}</small>
    )
}

const MultiChoiceItem: React.FC<{ question: UpkQuestion, choice: UpkQuestionChoice }> = ({question, choice}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer = useSelector(selectAnswer);
    const selected: Boolean = answer.values.includes(choice.choice_id)

    return (
        <li key={choice.choice_id} style={{marginBottom: '0.5rem'}}>
            <Button
                onClick={() => dispatch(addAnswer({question: question, val: choice.choice_id}))}
                variant={selected ? "default" : "secondary"}
            >
                {choice.choice_text}
            </Button>
        </li>
    )
}

const MultipleChoice: React.FC<{ question: UpkQuestion }> = ({question}) => {
    // const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    // const answer = useSelector(selectAnswer);

    return (
        // <small id="text-entry-msg">{answer.error_msg}</small>
        <ol style={{listStyle: 'none', padding: 0, margin: 0}}>
            {
                question.choices.map(c => {
                    return <MultiChoiceItem
                        key={`${question.question_id}-${c.choice_id}`}
                        question={question}
                        choice={c}/>
                })
            }
        </ol>
    )
}


const ProfileQuestionFull: React.FC<UpkQuestion> = ({question}) => {


    const renderContent = () => {
        switch (question.question_type) {
            case 'TE':
                return <TextEntry question={question}/>
            case 'MC':
                return <MultipleChoice question={question}/>
        }
    };

    return (
        <Card className="@container/card relative">
            <Badge
                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="outline"
                title={`Currently ${question.task_count.toLocaleString()} surveys use this profiling question`}
            >
                {question.task_count.toLocaleString()}
            </Badge>

            <CardHeader>
                <CardTitle>{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </CardFooter>
        </Card>
    )
}

const QuestionsPage = () => {
    const questions = useAppSelector(state => state.questions)
    const [activeQuestionID, setQuestionID] = useState(() => questions[0].question_id);

    const question = questions.find(q => q.question_id === activeQuestionID);
    console.log("activeQuestionID:", activeQuestionID, question)

    return (
        <div>
            <p>
                A total of {questions.length} questions are available.
            </p>

            <Pagination className="mt-4 mb-4">
                <PaginationContent>
                    {
                        questions.slice(0, 5).map((q, i) => {
                            return (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        title={q.question_text}
                                        onClick={() => setQuestionID(q.question_id)}
                                        isActive={q.question_id === activeQuestionID}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })
                    }

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


            <ProfileQuestionFull key={question.question_id} question={question} className="mt-4 mb-4"/>
        </div>
    )
}

export {
    QuestionsPage
}