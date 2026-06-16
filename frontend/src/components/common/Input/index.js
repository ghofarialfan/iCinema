import React from "react";
import "./style.css";

const getSafeIcon = (iconClass, type, name, placeholder) => {
  const key = `${iconClass || ""} ${type || ""} ${name || ""} ${
    placeholder || ""
  }`.toLowerCase();

  if (key.includes("envelope") || key.includes("email")) return "✉";
  if (key.includes("key") || key.includes("lock") || key.includes("password")) return "●";
  if (key.includes("search")) return "⌕";
  if (key.includes("film") || key.includes("movie") || key.includes("title")) return "🎬";
  if (key.includes("star") || key.includes("rating")) return "★";
  if (key.includes("clock") || key.includes("time") || key.includes("length") || key.includes("duration")) return "⏱";
  if (key.includes("link") || key.includes("trailer") || key.includes("youtube")) return "🔗";
  if (key.includes("genre") || key.includes("tag")) return "▾";
  if (key.includes("user")) return "👤";

  return "•";
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
