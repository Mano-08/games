function Button({ theme, text, callback, className, style, disabled }) {
  return (
    <button
      onClick={callback}
      style={style}
      disabled={disabled}
      className={`${
        theme === "green"
          ? "bg-green-600 outline-green-400"
          : theme === "reset"
          ? "bg-sky-900 outline-sky-600"
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
