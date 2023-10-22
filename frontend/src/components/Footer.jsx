const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2023
      </em>
    </div>
  );
};

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      // ...
      <Footer />
    </div>
  );
};

export default Footer;