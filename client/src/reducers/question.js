import { GET_QUESTIONS, QUESTION_ERROR } from '../actions/types';

const initialState = {
  questions: [],
  question: null,
  loading: true,
  error: {},
};
