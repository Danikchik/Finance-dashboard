import { useEffect } from "react";
import Icon from "./Icon";
import "./Modal.scss";

function Modal({ title, subtitle, icon = "edit", tone = "default", onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__head">
          <span className={`modal__icon modal__icon--${tone}`}>
            <Icon name={icon} size={22} />
          </span>

          <div className="modal__titles">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

export default Modal;
