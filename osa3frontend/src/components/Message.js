import React from "react";

const Message = ({ message }) => {

  if (message.content === null) {
      return null;
  }
  return (
    <div style={message.style}>
        {message.content}
    </div>
  );
};

export default Message