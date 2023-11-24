import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Toggable from "./components/Toggable";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import blogServices from "./services/blogs";
import loginServices from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  const loginFormRef = useRef();
  const blogFormRef = useRef();

  useEffect(() => {
    const userJSON = window.localStorage.getItem("blogAppUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogServices.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    async function getAllBlogs() {
      const list = await blogServices.getAll();
      const sortedList = list.sort(function (a, b) {
        return a.likes - b.likes;
      });
      setBlogs(sortedList);
    }
    getAllBlogs();
  }, []);

  const handleLogin = async (credentials) => {
    loginFormRef.current.toggleVisibility();
    try {
      const user = await loginServices.login(credentials);
      window.localStorage.setItem("blogAppUser", JSON.stringify(user));
      blogServices.setToken(user.token);
      setUser(user);
      setMessage({
        type: "success",
        content: "Logged in success",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage({
        type: "error",
        content: "Incorrect username or password",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("blogAppUser");
    blogServices.setToken(null);
    setUser(null);
    setMessage({
      type: "success",
      content: "Logged out success",
    });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();

    try {
      const addedBlog = await blogServices.create(newBlog);
      console.log(addedBlog);
      const updatedList = await blogServices.getAll();
      setBlogs(updatedList);
      // setBlogs(blogs.concat(addedBlog));
      setMessage({
        type: "success",
        content: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage({
        type: "error",
        content: exception.response.data.error,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleRemove = async (blog) => {
    try {
      await blogServices.remove(blog.id);
      const updatedList = blogs.filter((b) => b.id !== blog.id);
      setBlogs(updatedList);
      setMessage({
        type: "info",
        content: `deleted ${blog.title}`,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage({
        type: "error",
        content: exception.response.data.error,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (updatedBlog) => {
    try {
      await blogServices.like(updatedBlog.id, updatedBlog);
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response.data.error,
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const blogForm = () => {
    return (
      <Toggable btnLabel='create blog' ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Toggable>
    );
  };

  const loginForm = () => {
    return (
      <Toggable btnLabel='login' ref={loginFormRef}>
        <LoginForm handleLogin={handleLogin} />
      </Toggable>
    );
  };

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={message} />
      {!user && loginForm()}
      {user && (
        <>
          <h4>
            logged in as {user.username}{" "}
            <button onClick={handleLogout}>logout</button>
          </h4>
          {blogForm()}
        </>
      )}
      <hr />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleRemove={handleRemove}
          handleLike={handleLike}
        />
      ))}
    </div>
  );
};

export default App;
