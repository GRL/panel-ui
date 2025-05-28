// import { createContext, useContext, useState, ReactNode } from 'react';
// import {ProfilingQuestion} from "@/models/question.ts"
//
// type View = 'offerwall' | 'questions' | 'cashout';
//
// type ViewContextType = {
//     activeView: View;
//     setActiveView: (view: View) => void;
// };
//
// type ProfilingQuestionMap = Map<string, ProfilingQuestion>;
//
// interface ProfilingQuestionsContextType {
//     answers: ProfilingQuestionMap;
//     setAnswer: (questionId: string, values: string[]) => void;
//     clearAnswers: () => void;
// }
//
// interface ProfilingQuestionsContextType {
//     questions: ProfilingQuestion[];
//     setQuestions: (questions: ProfilingQuestion[]) => void;
//     getQuestionById: (id: string) => ProfilingQuestion | undefined;
// }
//
// const ViewContext = createContext<ViewContextType | undefined>(undefined);
//
// export function useViewContext() {
//     const context = useContext(ViewContext);
//     if (!context) {
//         throw new Error('useViewContext must be used within a ViewProvider');
//     }
//     return context;
// }
//
// export function ViewProvider({ children }: { children: ReactNode }) {
//     const [activeView, setActiveView] = useState<View>('offerwall');
//
//     return (
//         <ViewContext.Provider value={{ activeView, setActiveView }}>
//             {children}
//         </ViewContext.Provider>
//     );
// }