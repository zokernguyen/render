import { useState } from "react";
import PropTypes from 'prop-types';

const Blog = ({ blog, handleRemove, handleLike }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(blog);

  const remove = (blog) => {
    handleRemove(blog);
  };

  const like = () => {
    const updatedBlog = {
      ...currentBlog,
      likes: currentBlog.likes + 1,
    };
    setCurrentBlog(updatedBlog);
    handleLike(updatedBlog);
  };

  return showDetail ? (
    <div className='blog'>
      <p className='title'>
        {currentBlog.title}{" "}
        <button onClick={() => setShowDetail(false)}>hide</button>
      </p>
      <a href={currentBlog.url}>{currentBlog.url}</a>
      <p>
        likes {currentBlog.likes} <button onClick={like}>like</button>
      </p>
      <p className='author'>{currentBlog.user.username}</p>
      <button className='remove' onClick={() => remove(currentBlog)}>
        remove
      </button>
    </div>
  ) : (
    <div className='blog'>
      <p>
        <span className='title'>{currentBlog.title}</span>
        <span className='author'> - by {currentBlog.author}</span>{" "}
        <button onClick={() => setShowDetail(true)}>view</button>
      </p>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
};

export default Blog;
