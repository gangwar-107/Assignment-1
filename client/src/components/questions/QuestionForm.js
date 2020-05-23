import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addQuestion } from '../../actions/question';

const QuestionForm = ({ addQuestion }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
  });

  const { title, text } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div class='post-form'>
      <div class='bg-primary p'>
        <h3>Post a question</h3>
      </div>
      <form
        class='form my-1'
        onSubmit={(e) => {
          e.preventDefault();
          addQuestion({ title, text });
          setFormData({ title: '', text: '' });
        }}
      >
        <textarea
          name='title'
          cols='30'
          rows='1'
          placeholder='Type a title'
          value={title}
          onChange={(e) => onChange(e)}
          required
        ></textarea>
        <br />
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Write a question'
          value={text}
          onChange={(e) => onChange(e)}
          required
        ></textarea>
        <input type='submit' class='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

QuestionForm.propTypes = {
  addQuestion: PropTypes.func.isRequired,
};

export default connect(null, { addQuestion })(QuestionForm);
