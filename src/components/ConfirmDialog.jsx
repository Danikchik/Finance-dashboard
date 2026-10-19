import Modal from "./Modal";
import "./Modal.scss";

function ConfirmDialog({ title, message, details, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal title={title} icon="trash" tone="danger" onClose={onCancel}>
      <p className="confirm__message">{message}</p>

      {details && <div className="confirm__details">{details}</div>}

      <div className="modal__footer">
        <button type="button" className="btn btn--ghost" onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
