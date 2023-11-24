import { useState } from "react";

const BlogForm = ({ handleCreateBlog }) => {
  
  const initState = {
    title: "",
    author: "",
    url: "",
  };
  
  const [newBlog, setNewBlog] = useState(initState);

  const handleCreateBlogInput = (newBlog) => {
    setNewBlog(newBlog);
  };

  const createBlog = (e) => {
    e.preventDefault();
    handleCreateBlog(newBlog);
    setNewBlog(initState);
  };

  return (
    <form onSubmit={createBlog}>
      <h2>create new</h2>
      title:{" "}
      <input
        name='title'
        value={newBlog.title}
        onChange={(e) =>
          handleCreateBlogInput({
            ...newBlog,
            title: e.target.value,
          })
        }
      />
      <br />
      author:{" "}
      <input
        name='author'
        value={newBlog.author}
        onChange={(e) =>
          handleCreateBlogInput({
            ...newBlog,
            author: e.target.value,
          })
        }
      />
      <br />
      url:{" "}
      <input
        name='url'
        value={newBlog.url}
        onChange={(e) =>
          handleCreateBlogInput({
            ...newBlog,
            url: e.target.value,
          })
        }
      />
      <br />
      <button type='submit'>create</button>
    </form>
  );
};

export default BlogForm;
