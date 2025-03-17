import React from 'react';

const Navigation = ({ next, previous }) => {
  return (
    <div>
      <button onClick={previous}>Previous</button>
      <button onClick={next}>Next</button>
    </div>
  );
};

export default Navigation;
