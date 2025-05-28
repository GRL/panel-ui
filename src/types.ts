/* ------ Generic ------ */
export interface GRLWidgetSettings {
    targetId: string,
    bpid: string;
    bpuid: string;
    offerwall: string;
    walletMode: boolean;
    panelName: string | null;
    leaderboard: boolean;
}

/* ------ Buckets ------ */

/* ------ Profiling Questions ------ */
export type QuestionType = "MC" | "TE"
export type SelectorType = "SL" | "ML" | "SA" | "MA"

export interface PatternType {
    message: string
    pattern: string
}

export interface ValidationType {
    patterns: PatternType[]
}

export interface ChoiceType {
    order: number;  // 0 index
    choice_id: string;  // string of a number
    choice_text: string

    exclusive?: boolean
    task_count?: number
    task_score?: number
}

export interface ConfigurationType {
    max_length?: number
    max_select?: number
}

export interface ProfilingQuestionType {
    $comment?: string

    choices: ChoiceType[]
    validation: ValidationType
    configuration: ConfigurationType

    country_iso: string
    language_iso: string

    question_id: string
    question_text: string
    question_type: QuestionType

    selector: SelectorType
    task_count?: number
    task_score: number
    p: number

    // Private!
    _complete: boolean
    _processing: boolean
    _answer: string[]
}

export interface AnswerValueItemType {
    value: string
}

export interface AnswerType {
    question_id: string
    values: AnswerValueItemType[]
}