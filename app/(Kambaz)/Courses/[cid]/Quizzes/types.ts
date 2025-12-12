export interface Choice {
    _id: string;
    text: string;
    isCorrect: boolean;
  }

export interface Question {
    _id: string;
    type: "MCQ" | "TRUE_FALSE" | "FILL_IN_BLANK";
    title: string;
    points: number;
    text: string;
  
    choices?: { _id: string; text: string; isCorrect: boolean }[];
    correctBoolean?: boolean;
    acceptableAnswers?: string[];
    editing?: boolean;   

  }
  