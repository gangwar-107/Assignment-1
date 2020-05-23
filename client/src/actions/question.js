import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_QUESTIONS,
  QUESTION_ERROR,
  UPDATE_UPVOTES,
  DELETE_QUESTION,
  ADD_QUESTION,
  GET_QUESTION,
  ADD_RESPONSE,
  REMOVE_RESPONSE,
} from './types';

// get questions
export const getQuestions = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/questions');

    dispatch({
      type: GET_QUESTIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add upvote
export const addUpvote = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/questions/upvote/${id}`);

    dispatch({
      type: UPDATE_UPVOTES,
      payload: { id, upvotes: res.data },
    });
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// remove upvote
export const removeUpvote = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/questions/downvote/${id}`);

    dispatch({
      type: UPDATE_UPVOTES,
      payload: { id, upvotes: res.data },
    });
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Question
export const deleteQuestion = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/questions/${id}`);

    dispatch({
      type: DELETE_QUESTION,
      payload: id,
    });

    dispatch(setAlert('Question Removed', 'success'));
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add question
export const addQuestion = ({ title, text }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ title, text });

  try {
    const res = await axios.post('/api/questions', body, config);

    dispatch({
      type: ADD_QUESTION,
      payload: res.data,
    });

    dispatch(setAlert('Question Posted', 'success'));
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// get question
export const getQuestion = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/questions/${id}`);

    dispatch({
      type: GET_QUESTION,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Response
export const addResponse = (id, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      `/api/questions/response/${id}`,
      formData,
      config
    );

    dispatch({
      type: ADD_RESPONSE,
      payload: res.data,
    });

    dispatch(setAlert('Response Added', 'success'));
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Response
export const deleteResponse = (id, responseId) => async (dispatch) => {
  try {
    await axios.delete(`/api/questions/response/${id}/${responseId}`);

    dispatch({
      type: REMOVE_RESPONSE,
      payload: responseId,
    });

    dispatch(setAlert('Response Removed', 'success'));
  } catch (err) {
    dispatch({
      type: QUESTION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
