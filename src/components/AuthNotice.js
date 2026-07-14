function AuthNotice({ type = 'success', children }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-red-200 bg-red-50 text-red-700',
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type] || styles.success}`}>{children}</div>;
}

export default AuthNotice;
