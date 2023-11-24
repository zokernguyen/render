import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from 'prop-types';

const Toggable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility,
        };
    });
  
  Toggable.propTypes = {
    btnLabel: PropTypes.string.isRequired
  };
    
  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.btnLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  );
});

Toggable.displayName = 'Toggable';

export default Toggable;
