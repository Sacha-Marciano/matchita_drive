'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

type BaseModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string // Optional: allow custom modal box styling
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className = '',
}: BaseModalProps) {
  return (
    <Dialog as={Fragment} open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Modal content */}
        <DialogPanel
          className={`relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-matchita-text-alt ${className}`}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
