export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-semibold text-(--text-primary)">{label}</span> : null}
      <input
        className={`soft-input w-full rounded-lg px-4 py-3 text-sm shadow-sm transition-all placeholder:text-(--muted) focus:outline-none hover:border-(--primary) ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs font-medium text-(--danger)">{error}</span> : null}
    </label>
  );
}
