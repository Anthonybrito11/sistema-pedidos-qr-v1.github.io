import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  url: string
  disabled: boolean
  onSent: () => void
}

export function WhatsAppButton({ url, disabled, onSent }: WhatsAppButtonProps) {
  function handleClick() {
    if (disabled) {
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
    onSent()
  }

  return (
    <button
      type="button"
      className="primary-button w-full"
      onClick={handleClick}
      disabled={disabled}
      data-testid="send-whatsapp"
    >
      <MessageCircle size={18} aria-hidden="true" />
      Enviar por WhatsApp
    </button>
  )
}
