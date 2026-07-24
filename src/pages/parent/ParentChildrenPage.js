import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, Trash2 } from 'lucide-react';
import { getChildrenForParent, saveChildrenForParent } from '../../utils/storage';

function ParentChildrenPage() {
  const { t } = useTranslation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [children, setChildren] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', allergies: '', notes: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (currentUser?.email) {
      setChildren(getChildrenForParent(currentUser.email));
    }
  }, [currentUser]);

  const persist = (nextChildren) => {
    setChildren(nextChildren);
    if (currentUser?.email) {
      saveChildrenForParent(currentUser.email, nextChildren);
    }
  };

  const resetForm = () => {
    setForm({ name: '', age: '', allergies: '', notes: '' });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.age) return;

    if (editingId) {
      persist(children.map((child) => (child.id === editingId ? { ...child, ...form } : child)));
    } else {
      const newChild = { id: Date.now().toString(), ...form };
      persist([newChild, ...children]);
    }
    resetForm();
  };

  const handleEdit = (child) => {
    setEditingId(child.id);
    setForm({ name: child.name, age: child.age, allergies: child.allergies || '', notes: child.notes || '' });
  };

  const handleDelete = (id) => {
    persist(children.filter((child) => child.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('parentSpace.children.tag')}</p>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.children.title')}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('parentSpace.children.subtitle')}</p>

        <div className="mt-6 space-y-4">
          {children.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('parentSpace.children.empty')}</p>
          ) : children.map((child) => (
            <div key={child.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <Baby size={20} />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{child.name} • {child.age} {t('parentSpace.children.yearsOld')}</p>
                    {child.allergies && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{t('parentSpace.children.allergies')} : {child.allergies}</p>}
                    {child.notes && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{child.notes}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => handleEdit(child)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">{t('parentSpace.children.edit')}</button>
                  <button type="button" onClick={() => handleDelete(child.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{editingId ? t('parentSpace.children.editTag') : t('parentSpace.children.addTag')}</p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{editingId ? t('parentSpace.children.editTitle') : t('parentSpace.children.createTitle')}</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.children.fields.name')}
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.children.fields.age')}
            <input type="number" min="0" max="17" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.children.fields.allergies')}
            <input value={form.allergies} onChange={(event) => setForm({ ...form, allergies: event.target.value })} placeholder={t('parentSpace.children.fields.allergiesPlaceholder')} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.children.fields.notes')}
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="3" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">{editingId ? t('parentSpace.children.save') : t('parentSpace.children.addChild')}</button>
            {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-300">{t('parentSpace.children.cancel')}</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParentChildrenPage;