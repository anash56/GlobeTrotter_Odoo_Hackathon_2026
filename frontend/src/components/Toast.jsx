import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="#10B981" />}
          {toast.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
          {toast.type === 'info' && <Info size={20} color="#00E5FF" />}
          <span>{toast.message}</span>
          <button 
            onClick={() => onDismiss(toast.id)} 
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
