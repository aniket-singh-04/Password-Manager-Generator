export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring--primary) focus:ring-offset-2 focus:ring-offset--bg-start)';

  const styles = {
    primary: `${base} brand-gradient text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5`,
    secondary: `${base} bg--surface) text-(-text-primary) border-2 border--border) hover:border--primary) hover:bg--bg-hover) hover:shadow-md`,
    danger: `${base} bg--danger) text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5`,
    success: `${base} bg--success) text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5`,
    warning: `${base} bg--warning) text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5`,
    ghost: `${base} bg-transparent text-(-text-primary) hover:bg--bg-hover) hover:text-(-primary)`
  };

  return (
    <button className={`${styles[variant] || styles.primary} ${className} btn-icon`} {...props}>
      {children}
    </button>
  );
}
