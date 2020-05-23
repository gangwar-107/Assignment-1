import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import {
  addUpvote,
  removeUpvote,
  deleteQuestion,
} from '../../actions/question';

const QuestionItem = ({
  addUpvote,
  removeUpvote,
  deleteQuestion,
  auth,
  question: { _id, title, text, name, avatar, user, upvotes, responses, date },
  showActions,
}) => (
  <div class='post bg-white p-1 my-1'>
    <div>
      <a>
        <img class='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </a>
    </div>
    <div>
      <strong class='my-1'> Question: {title}</strong>
      <p class='my-1'>{text}</p>
      <p class='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>

      {showActions && (
        <Fragment>
          <button
            onClick={(e) => addUpvote(_id)}
            type='button'
            class='btn btn-light'
          >
            <i class='fas fa-thumbs-up'></i>
            <span>{upvotes.length > 0 && <span>{upvotes.length}</span>}</span>
          </button>
          <button
            onClick={(e) => removeUpvote(_id)}
            type='button'
            class='btn btn-light'
          >
            <i class='fas fa-thumbs-down'></i>
          </button>
          <Link to={`/questions/${_id}`} class='btn btn-primary'>
            Responses{' '}
            {responses.length > 0 && (
              <span class='comment-count'>{responses.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={(e) => deleteQuestion(_id)}
              type='button'
              class='btn btn-danger'
            >
              <i class='fas fa-times'></i>
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

QuestionItem.defaultProps = {
  showActions: true,
};

QuestionItem.propTypes = {
  question: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addUpvote: PropTypes.func.isRequired,
  removeUpvote: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addUpvote,
  removeUpvote,
  deleteQuestion,
})(QuestionItem);
