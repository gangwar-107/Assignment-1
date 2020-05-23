import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteResponse } from '../../actions/question';

const ResponseItem = ({
  postId,
  response: { _id, text, name, avatar, user, date },
  auth,
  deleteResponse,
}) => (
  <div className='post bg-white p-1 my-1'>
    <div>
      <a>
        <img className='round-img' src={avatar} alt='' />
        <h4>{name}</h4>
      </a>
    </div>
    <div>
      <p className='my-1'>{text}</p>
      <p className='post-date'>
        Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
      </p>
      {!auth.loading && user === auth.user._id && (
        <button
          onClick={() => deleteResponse(postId, _id)}
          type='button'
          className='btn btn-danger'
        >
          <i className='fas fa-times' />
        </button>
      )}
    </div>
  </div>
);

ResponseItem.propTypes = {
  postId: PropTypes.string.isRequired,
  response: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteResponse: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteResponse })(ResponseItem);
