import React from "react";
import "./style.css";

const Input = ({ name, label, error, iconClass, type = "text", ...rest }) => {
  const isTextarea = type === "textarea";

  const commonProps = {
    id: name,
    name,
    className: "form-control",
    ...rest,
  };

  return (
    <div className="input-container">
      {label && <label htmlFor={name}>{label}</label>}

      <div className="input-field-wrapper">
        {iconClass && <span className={`input-icon ${iconClass}`} />}

        {isTextarea ? (
          <textarea {...commonProps} />
        ) : (
          <input type={type} {...commonProps} />
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
