import { useCallback, useRef, useState } from "react";
import { ToastContext } from "./toastContext";
import Icon from "./Icon";
import "./Toast.scss";

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message, options = {}) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, ...options });
    timer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      <div className="toast-area" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <span className="toast__icon">
              <Icon name="check" size={16} />
            </span>
            <span>{toast.message}</span>

            {toast.actionLabel && (
              <button
                type="button"
                className="toast__action"
                onClick={() => {
                  toast.onAction();
                  hide();
                }}
              >
                {toast.actionLabel}
              </button>
            )}

            <button type="button" className="toast__close" onClick={hide} aria-label="Dismiss">
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
