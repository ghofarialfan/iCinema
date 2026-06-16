import React from "react";
import "./style.css";

const getSafeIcon = (iconClass, type, name, placeholder, label) => {
  const key = `${iconClass || ""} ${type || ""} ${name || ""} ${
    placeholder || ""
  } ${label || ""}`.toLowerCase();

  if (key.includes("email") || key.includes("envelope")) return "✉️";
  if (key.includes("password") || key.includes("key") || key.includes("lock"))
    return "🔒";
  if (key.includes("search")) return "🔍";
  if (key.includes("rating") || key.includes("rate") || key.includes("star"))
    return "⭐";
  if (
    key.includes("duration") ||
    key.includes("length") ||
    key.includes("time") ||
    key.includes("clock")
  )
    return "⏱️";
  if (
    key.includes("trailer") ||
    key.includes("youtube") ||
    key.includes("link")
  )
    return "🔗";
  if (key.includes("genre") || key.includes("category") || key.includes("tag"))
    return "🏷️";
  if (
    key.includes("description") ||
    key.includes("summary") ||
    key.includes("synopsis")
  )
    return "📝";
  if (key.includes("title") || key.includes("movie") || key.includes("film"))
    return "🎬";

  return "";
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
  const icon = getSafeIcon(iconClass, type, name, placeholder, label);

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
        {icon && (
          <span className="input-icon" aria-hidden="true">
            {icon}
          </span>
        )}

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