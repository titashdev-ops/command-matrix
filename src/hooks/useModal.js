import { useEffect, useRef } from 'react';

const modalStack = [];

export function useModal({ isOpen, onClose, ref }) {
  // Store the element that had focus before opening the modal
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Record previously focused element
    previousFocusRef.current = document.activeElement;

    // Push to stack
    const modalId = Symbol('modal');
    modalStack.push({ id: modalId, onClose: () => onCloseRef.current?.() });

    const handleKeyDown = (e) => {
      // 1. Handle Escape
      if (e.key === 'Escape') {
        const topModal = modalStack[modalStack.length - 1];
        if (topModal && topModal.id === modalId) {
          e.preventDefault();
          e.stopPropagation();
          topModal.onClose();
        }
        return;
      }

      // 2. Handle Tab for Focus Trapping
      if (e.key === 'Tab' && ref.current) {
        const focusableElements = ref.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !ref.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !ref.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // use capture phase to ensure it runs first

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      const idx = modalStack.findIndex(m => m.id === modalId);
      if (idx !== -1) modalStack.splice(idx, 1);

      // Restore focus
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, ref]);
}
