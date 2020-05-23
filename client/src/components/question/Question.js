import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import QuestionItem from '../questions/QuestionItem';
import ResponseItem from '../question/ResponseItem';
import { getQuestion } from '../../actions/question';
import ResponseForm from './ResponseForm';

const Question = ({ getQuestion, question: { question, loading }, match }) => {
  useEffect(() => {
    getQuestion(match.params.id);
  }, [getQuestion, match.params.id]);
  return loading || question == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/questions' className='btn'>
        Back to Questions
      </Link>
      <QuestionItem question={question} showActions={false} />
      <ResponseForm postId={question._id} />
      <div className='comments'>
        {question.responses.map((response) => (
          <ResponseItem
            key={response._id}
            response={response}
            postId={question._id}
          />
        ))}
      </div>
    </Fragment>
  );
};

Question.propTypes = {
  getQuestion: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  question: state.question,
});

export default connect(mapStateToProps, { getQuestion })(Question);
