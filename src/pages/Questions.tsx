import React, {useMemo, useState} from 'react'
import {
    BodySubmitProfilingQuestionsProductIdProfilingQuestionsPost,
    ProfilingQuestionsApiFactory,
    UpkQuestion,
    UpkQuestionChoice,
    UserQuestionAnswerIn
} from "@/api";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/hooks.ts";
import answerSlice, {addAnswer, Answer,answerForQuestion, makeSelectChoicesByQuestion, saveAnswer} from "@/models/answerSlice.ts";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
} from "@/components/ui/pagination"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"

const TextEntry: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer: Answer = useSelector(selectAnswer);
    const error: Boolean = answer.error_msg.length > 0

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(addAnswer({question: question, val: event.target.value}))
    };

    return (
        <>
            <Input type="text"
                   id="text-entry-input"
                   aria-describedby=""
                   defaultValue={answer.values.length ? answer.values[0] : ""}
                   onKeyUp={handleInputChange}
                   title={error ? answer.error_msg : ""}
                   className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            />

            {
                error && <p className="text-sm text-red-500 mt-1">{answer.error_msg}</p>
            }
        </>

    )
}

const MultiChoiceItem: React.FC<{ question: UpkQuestion, choice: UpkQuestionChoice }> = ({question, choice}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer: Answer = useSelector(selectAnswer);
    const selected: Boolean = answer.values.includes(choice.choice_id)

    return (
        <li key={choice.choice_id} style={{marginBottom: '0.5rem'}}>
            <Button
                onClick={() => dispatch(addAnswer({question: question, val: choice.choice_id}))}
                className="cursor-pointer"
                variant={selected ? "default" : "secondary"}
            >
                {choice.choice_text}
            </Button>
        </li>
    )
}

const MultipleChoice: React.FC<{ question: UpkQuestion }> = ({question}) => {
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer: Answer = useSelector(selectAnswer);
    const error: Boolean = answer.error_msg.length > 0

    return (
        <>
            {
                error && <p className="text-sm text-red-500 mt-1">{answer.error_msg}</p>
            }

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
        </>
    )
}


const ProfileQuestionFull: React.FC<UpkQuestion> = ({question}) => {
    const dispatch = useAppDispatch()
    const selectAnswer = useMemo(() => makeSelectChoicesByQuestion(question), [question]);
    const answer: Answer = useSelector(selectAnswer);
    const app = useAppSelector(state => state.app)

    const provided_answer = answer.values.length > 0
    const error: Boolean = answer.error_msg.length > 0
    const can_submit = provided_answer && !error && !answer.complete

    const renderContent = () => {
        switch (question.question_type) {
            case 'TE':
                return <TextEntry question={question}/>
            case 'MC':
                return <MultipleChoice question={question}/>
        }
    };

    const submitAnswer = () => {
        if (!can_submit) {
            return;
        }

        if (answer.complete || answer.processing) {
            return
        }

        let body: BodySubmitProfilingQuestionsProductIdProfilingQuestionsPost = {
            'answers': [{
                "question_id": question.question_id,
                "answer": answer.values
            } as UserQuestionAnswerIn
            ]
        }
        console.log("submitAnswers", body)
        new ProfilingQuestionsApiFactory().submitProfilingQuestionsProductIdProfilingQuestionsPost(app.bpid, app.bpuid, body)
            .then(res => {
                if (res.status == 200) {
                    dispatch(saveAnswer({question: question}))
                } else {
                    // let error_msg = res.data.msg
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <Card className="@container/card relative">
            <Badge
                className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer"
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
            <CardFooter className="flex justify-end">
                <Button
                    type="submit"
                    className="w-1/3 cursor-pointer"
                    disabled={!can_submit}
                    onClick={submitAnswer}
                >
                    Submit
                </Button>
            </CardFooter>
        </Card>
    )
}
// type Props = {
//     onSetQuestionID: (name: string) => void
// }

const PaginationIcon: React.FC<{
    question: UpkQuestion, activeQuestionID: string, idx: number, onSetQuestionID: () => void
}> = ({question, activeQuestionID, idx, onSetQuestionID}) => {

    const answers = useAppSelector(state => state.answers)
    const answer = answers[question.question_id]

    return (
        <PaginationItem>
            <PaginationLink
                href="#"
                title={question.question_text}
                isActive={question.question_id === activeQuestionID}
                aria-disabled={answer?.complete}

                onClick={(e) => answer?.complete ? e.preventDefault() : onSetQuestionID(question.question_id)}
                className={answer?.complete ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}>
                {idx + 1}
            </PaginationLink>
        </PaginationItem>
    )
}

const QuestionsPage = () => {
    const questions = useAppSelector(state => state.questions)

    const [activeQuestionID, setQuestionID] = useState(() => questions[0].question_id);
    const question = questions.find(q => q.question_id === activeQuestionID);

    return (
        <div>
            <p>
                A total of {questions.length} questions are available.
            </p>

            <Pagination className="mt-4 mb-4">
                <PaginationContent>
                    {
                        questions.slice(0, 5).map((q, i) => {
                            return <PaginationIcon key={q.question_id} question={q} idx={i}
                                                   onSetQuestionID={setQuestionID}/>
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