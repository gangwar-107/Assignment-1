import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import QuestionItem from './QuestionItem';
import { getQuestions } from '../../actions/question';
import QuestionForm from './QuestionForm';

const Questions = ({ getQuestions, question: { questions, loading } }) => {
  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Questions</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to Stack Board
      </p>
      <QuestionForm />
      <div className='posts'>
        {questions.map((question) => (
          <QuestionItem key={question._id} question={question} />
        ))}
      </div>
    </Fragment>
  );
};

Questions.propTypes = {
  getQuestions: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  question: state.question,
});

export default connect(mapStateToProps, { getQuestions })(Questions);
