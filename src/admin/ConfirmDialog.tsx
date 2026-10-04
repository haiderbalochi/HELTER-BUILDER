import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Icon } from '@/components/ui/Icon'

interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  busy?: boolean
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  busy = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} eyebrow="Please confirm" className="sm:max-w-md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
              destructive
                ? 'border-[#ff6b57]/45 text-[#ff6b57]'
                : 'border-[#E9C46A]/45 text-[#E9C46A]'
            }`}
          >
            <Icon name={destructive ? 'trash' : 'eye-off'} size={18} />
          </span>
          <p className="text-[14.5px] leading-relaxed text-bone-mute">{body}</p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--hairline)] pt-5">
          <Button variant="ghost" size="md" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={destructive ? 'ghost' : 'primary'}
            size="md"
            onClick={onConfirm}
            disabled={busy}
            className={
              destructive
                ? '!border-[#ff6b57]/55 !text-[#ff6b57] hover:!bg-[#ff6b57]/10'
                : undefined
            }
            icon={busy ? undefined : destructive ? 'trash' : 'check'}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Spinner size={13} /> Working…
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
