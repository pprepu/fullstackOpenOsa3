import React from "react";

const Filter = ({ filter, onChangeFunction }) => {
  return (
    <form>
      filter shown with <input value={filter} onChange={onChangeFunction} />
    </form>
  );
};

export default Filter;