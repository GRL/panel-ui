
export interface Answer {
    questionId: string;
    values: string[];
    error_msg: string;

    _complete: boolean;
    _processing: boolean;
}