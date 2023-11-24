import { useState} from "react";

const LoginForm = ({ handleLogin }) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleLoginInput = (loginData) => {
    setLoginData(loginData);
  };

  const login = (e) => {
    e.preventDefault();
    handleLogin(loginData);
    setLoginData({
      username: "",
      password: "",
    });
  };

  return (
    <form onSubmit={login}>
      <div>
        username:{" "}
        <input
          type='text'
          value={loginData.username}
          name='Username'
          onChange={(e) => {
            handleLoginInput({
              ...loginData,
              username: e.target.value,
            });
          }}
        />
      </div>
      <div>
        password:{" "}
        <input
          type='password'
          value={loginData.password}
          name='Password'
          onChange={(e) => {
            handleLoginInput({
              ...loginData,
              password: e.target.value,
            });
          }}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
};

export default LoginForm;
