function Button({ theme, text, callback, className }) {
  return (
    <button
      onClick={callback}
      className={`${
        theme === "green"
          ? "bg-green-600 outline-green-400"
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
