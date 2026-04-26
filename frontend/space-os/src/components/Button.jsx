export default function Button({ children, variant="primary" }) {
  const styles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    white: "bg-white text-emerald-600 hover:bg-gray-100"
  };

  return (
    <button className={`px-6 py-3 rounded-lg font-semibold transition ${styles[variant]}`}>
      {children}
    </button>
  );
}
