import React from "react";

const Filter = ({ filter, handleFilterInput }) => {
  return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          filter show with
          <input value={filter} onChange={handleFilterInput} />
        </div>
      </form>
  );
};

export default Filter;