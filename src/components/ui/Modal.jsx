import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react'

const Modal = forwardRef(({
  id,
  open,
  title,
  description,
  children,
  footer,
  onClose,
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
}, ref) => {
  const generatedId = useId()
  const dialogRef = useRef(null)
  const dialogId = id ?? generatedId
  const modalClassName = ['modal', className].filter(Boolean).join(' ')
  const boxClassName = ['modal-box', 'relative', contentClassName].filter(Boolean).join(' ')

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
    element: dialogRef.current,
  }), [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = (event) => {
      onClose?.(event)
    }

    dialog.addEventListener('close', handleClose)

    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || open === undefined) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      id={dialogId}
      ref={dialogRef}
      className={modalClassName}
      aria-modal="true"
    >
      <div className={boxClassName}>
        {showCloseButton && (
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        )}

        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {description && <p className="py-4">{description}</p>}
        {children}

        {footer && <div className="modal-action">{footer}</div>}
      </div>

      {closeOnBackdrop && (
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Cerrar modal" />
        </form>
      )}
    </dialog>
  )
})

Modal.displayName = 'Modal'

export default Modal