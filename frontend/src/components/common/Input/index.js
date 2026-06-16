import React from "react";
import "./style.css";

const getSafeIcon = (iconClass, type, name, placeholder) => {
  const key = `${iconClass || ""} ${type || ""} ${name || ""} ${
    placeholder || ""
  }`.toLowerCase();

  if (key.includes("email") || key.includes("envelope")) return "E";
  if (key.includes("password") || key.includes("key") || key.includes("lock"))
    return "P";
  if (key.includes("search")) return "S";
  if (key.includes("rating") || key.includes("star")) return "R";
  if (
    key.includes("duration") ||
    key.includes("length") ||
    key.includes("time") ||
    key.includes("clock")
  )
    return "T";
  if (
    key.includes("trailer") ||
    key.includes("youtube") ||
    key.includes("link")
  )
    return "L";
  if (key.includes("genre") || key.includes("tag")) return "G";
  if (key.includes("title") || key.includes("movie") || key.includes("film"))
    return "M";

  return "I";
};

const Input = ({
  name,
  label,
  error,
  iconClass,
  type = "text",
  placeholder,
  ...rest
}) => {
  const isTextarea = type === "textarea";
  const icon = getSafeIcon(iconClass, type, name, placeholder);

  const commonProps = {
    id: name,
    name,
    className: "form-control",
    placeholder,
    ...rest,
  };

  return (
    <div className="input-container">
      {label && <label htmlFor={name}>{label}</label>}

      <div className={`input-field-wrapper ${isTextarea ? "is-textarea" : ""}`}>
        <span className="input-icon" aria-hidden="true">
          {icon}
        </span>

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
