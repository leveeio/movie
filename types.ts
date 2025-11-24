export interface MovieResource {
  id: string;
  title: string;
  year: number | string; // Allow string for "Unknown" if AI fails
  director: string;
  genre: string[];
  country?: string; // Added country field
  synopsis: string;
  posterUrl: string;
  styleKeywords: string[];
  systemNotes: string; // "Investigative" notes
  link?: string; // Cloud drive link
}

export enum ViewState {
  GRID = 'GRID',
  LIST = 'LIST'
}

export interface AnalysisResult {
  psychologicalProfile: string;
  visualMotifs: string[];
  riskAssessment: string; // High/Medium/Low based on "intensity"
}