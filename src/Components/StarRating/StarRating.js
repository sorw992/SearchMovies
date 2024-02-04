import { useState } from "react";
// for using prop types
import PropTypes from "prop-types";

import Star from "./Star";

const containerStyle = {
  display: "flex",
  // align the items vertically
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

// propTypes must be lower case
StarRating.propTypes = {
  // isRequired is for the props that is necessary. if the that prop hasn't been passed we can see error in console. but we have default values for our props in this component. (it doesn't make sense to make them require here)
  // maxRating: PropTypes.number.isRequired,
  maxRating: PropTypes.number.isRequired,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func,
};

export default function StarRating({
  // note: setting default value for props
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  // for hover on starts
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    // update internal rating
    setRating(rating);
    // update external rating
    onSetRating(rating);
  }

  const textStyle = {
    // problem: what is it
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {/* note Array.from(): define an empty array with length property */}
        {/* second argument is a map functoion that loops through the array */}
        {/* _ is elements that we are not interested */}
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            // if there is a tempRating then (roshan mishe star) else (az rating star roshan mishe)
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            // passing handler function to child component with props
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      {/* tempRating || rating || "" -> if there is no tempRating then display rating */}
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
