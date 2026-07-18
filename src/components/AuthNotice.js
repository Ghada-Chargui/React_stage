function AuthNotice({ type = 'success', children }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/30 dark:text-emerald-300',
    error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-900/30 dark:text-red-300',
  };

  return <div className={`rounded-3xl border px-6 py-4 text-sm font-medium shadow-sm ${styles[type] || styles.success}`}>{children}</div>;
}

export default AuthNotice;
