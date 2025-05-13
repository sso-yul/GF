import "../../styles/modal.css"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {title && <h4 className="modal-title">{title}</h4>}
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
