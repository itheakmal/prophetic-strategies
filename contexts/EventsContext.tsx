'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export type Choice = 'action' | 'reaction' | null;

export interface EventState {
  // Current event state
  currentEventId: string;
  choice: Choice;
  answerIndex: number | null;
  answerChecked: boolean;
  thinkDeeper: boolean;
  journal: string;
  savedAt: string | null;
  mediaIndex: number;

  // Progress tracking
  progress: number;
  badges: string[];

  // Navigation
  availableEvents: string[];
}

export type EventAction =
  | { type: 'SET_CURRENT_EVENT'; payload: string }
  | { type: 'SET_CHOICE'; payload: Choice }
  | { type: 'SET_ANSWER_INDEX'; payload: number | null }
  | { type: 'SET_ANSWER_CHECKED'; payload: boolean }
  | { type: 'SET_THINK_DEEPER'; payload: boolean }
  | { type: 'SET_JOURNAL'; payload: string }
  | { type: 'SET_SAVED_AT'; payload: string | null }
  | { type: 'SET_MEDIA_INDEX'; payload: number }
  | { type: 'RESET_EVENT_STATE' }
  | { type: 'LOAD_STATE'; payload: Partial<EventState> }
  | { type: 'SWITCH_EVENT'; payload: string };

// Initial state
const initialState: EventState = {
  currentEventId: 'hilf-al-fudul',
  choice: null,
  answerIndex: null,
  answerChecked: false,
  thinkDeeper: false,
  journal: '',
  savedAt: null,
  mediaIndex: 0,
  progress: 0,
  badges: [],
  availableEvents: ['hilf-al-fudul', 'nabuwah'],
};

// Reducer
function eventsReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    case 'SET_CURRENT_EVENT':
      return { ...state, currentEventId: action.payload };

    case 'SWITCH_EVENT':
      return {
        ...state,
        currentEventId: action.payload,
        choice: null,
        answerIndex: null,
        answerChecked: false,
        thinkDeeper: false,
        journal: '',
        savedAt: null,
        mediaIndex: 0,
      };

    case 'SET_CHOICE':
      return { ...state, choice: action.payload };

    case 'SET_ANSWER_INDEX':
      return { ...state, answerIndex: action.payload };

    case 'SET_ANSWER_CHECKED':
      return { ...state, answerChecked: action.payload };

    case 'SET_THINK_DEEPER':
      return { ...state, thinkDeeper: action.payload };

    case 'SET_JOURNAL':
      return { ...state, journal: action.payload };

    case 'SET_SAVED_AT':
      return { ...state, savedAt: action.payload };

    case 'SET_MEDIA_INDEX':
      return { ...state, mediaIndex: action.payload };

    case 'RESET_EVENT_STATE':
      return {
        ...state,
        choice: null,
        answerIndex: null,
        answerChecked: false,
        thinkDeeper: false,
        journal: '',
        savedAt: null,
        mediaIndex: 0,
      };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Context
const EventsContext = createContext<{
  state: EventState;
  dispatch: React.Dispatch<EventAction>;
} | null>(null);

// Provider component
export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('haf_state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('haf_state', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }, [state]);

  return (
    <EventsContext.Provider value={{ state, dispatch }}>
      {children}
    </EventsContext.Provider>
  );
}

// Hook to use the context
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}

// Custom hooks for specific state slices
export function useEventProgress() {
  const { state } = useEvents();

  const progress = React.useMemo(() => {
    let p = 0;
    if (state.choice) p += 25;
    if (state.answerChecked) p += 35;
    if (state.thinkDeeper) p += 20;
    if (state.journal.trim().length > 0) p += 20;
    return Math.min(100, p);
  }, [state.choice, state.answerChecked, state.thinkDeeper, state.journal]);

  const badges = React.useMemo(() => {
    const b: string[] = [];
    if (state.choice) b.push('Justice Seeker');
    if (state.answerChecked) b.push('Insightful Reader'); // We'll need to add correct answer logic
    if (state.journal.trim().length >= 80) b.push('Reflective Heart');
    if (state.thinkDeeper) b.push('Student of Knowledge');
    return b;
  }, [state.choice, state.answerChecked, state.journal, state.thinkDeeper]);

  return { progress, badges };
}

export function useEventActions() {
  const { dispatch } = useEvents();

  return {
    setChoice: (choice: Choice) =>
      dispatch({ type: 'SET_CHOICE', payload: choice }),
    setAnswerIndex: (index: number | null) =>
      dispatch({ type: 'SET_ANSWER_INDEX', payload: index }),
    setAnswerChecked: (checked: boolean) =>
      dispatch({ type: 'SET_ANSWER_CHECKED', payload: checked }),
    setThinkDeeper: (deeper: boolean) =>
      dispatch({ type: 'SET_THINK_DEEPER', payload: deeper }),
    setJournal: (journal: string) =>
      dispatch({ type: 'SET_JOURNAL', payload: journal }),
    setSavedAt: (savedAt: string | null) =>
      dispatch({ type: 'SET_SAVED_AT', payload: savedAt }),
    setMediaIndex: (index: number) =>
      dispatch({ type: 'SET_MEDIA_INDEX', payload: index }),
    resetEventState: () => dispatch({ type: 'RESET_EVENT_STATE' }),
    switchEvent: (eventId: string) =>
      dispatch({ type: 'SWITCH_EVENT', payload: eventId }),
  };
}
