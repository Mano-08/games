import React, { CSSProperties } from "react";

function Button({
  theme,
  text,
  callback,
  className,
  style,
  disabled,
}: {
  theme: null | string;
  text: string;
  callback: () => void;
  className: string | null;
  style: CSSProperties | undefined;
  disabled: boolean | null;
}) {
  return (
    <button
      onClick={callback}
      style={style}
      disabled={disabled ?? false}
      className={`${
        theme === "green"
          ? "bg-green-600 outline-green-400"
          : theme === "reset"
          ? "bg-sky-900 outline-sky-600"
          : theme === "gray"
          ? "bg-neutral-500 outline-neutral-400"
          : "bg-red-500 outline-red-400"
      } ${
        className && className
      } hover:outline text-base rounded-lg px-8 py-3 transition-colors duration-300 text-white`}
    >
      {text}
    </button>
  );
}

export default Button;
