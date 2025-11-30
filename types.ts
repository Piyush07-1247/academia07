export interface User {
  email: string;
  uid: string;
}

export interface StudentProfile {
  uid: string;
  displayName: string;
  email: string;
  branch: string;
  currentSemester: string; // Changed from year to currentSemester (e.g., "1", "8")
  skills: string[];
  bio: string;
  linkedin?: string;
  github?: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  assignmentsDone: number;
  chaptersDone: number;
  notesLink: string;
  isTheory: boolean; // Helper for dashboard calculation
  code?: string;
}

export interface SubjectMarks {
  st1: number;
  st2: number;
  st3: number;
  assignments: number;
  quizzes: number;
  attendance: number;
}

export interface SemesterData {
  id: string;
  sgpa: number;
  credits: number;
  semesterNumber: number;
}

export interface CurriculumSubject {
  code: string;
  name: string;
  credits: number;
  type: 'Theory' | 'Practical' | 'Audit';
}

export interface SemesterCurriculum {
  semester: number;
  subjects: CurriculumSubject[];
  totalCredits: number;
}