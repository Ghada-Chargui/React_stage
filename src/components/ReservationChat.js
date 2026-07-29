import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { getMessagesForReservation, sendMessage, STORAGE_CHANGE_EVENT_NAME } from '../utils/storage';

/**
 * Petit chat lié à une réservation précise. Les messages sont partagés
 * entre le parent et la babysitter concernés (stockés sous la clé
 * confiSitMessages, indexée par reservationId), avec synchronisation
 * automatique via le même mécanisme que le reste de l'app.
 */
function ReservationChat({ reservationId, currentUser, otherPartyName }) {
  const [messages, setMessages] = useState(() => getMessagesForReservation(reservationId));
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const syncMessages = () => setMessages(getMessagesForReservation(reservationId));
    syncMessages();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncMessages);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncMessages);
  }, [reservationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    sendMessage(reservationId, {
      author: currentUser?.name || 'Utilisateur',
      role: currentUser?.role,
      text: draft,
    });
    setDraft('');
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-4 py-2.5 dark:border-slate-700">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Discussion avec {otherPartyName || 'l’autre partie'}
        </p>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500">
            Aucun message pour le moment. Dites bonjour 👋
          </p>
        ) : (
          messages.map((message, index) => {
            const isMine = message.author === currentUser?.name;
            return (
              <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    isMine
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {!isMine && <p className="mb-0.5 text-xs font-semibold opacity-70">{message.author}</p>}
                  <p>{message.text}</p>
                  <p className={`mt-1 text-[10px] ${isMine ? 'text-orange-100' : 'text-slate-400'}`}>{message.time}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          type="submit"
          aria-label="Envoyer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
          disabled={!draft.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ReservationChat;