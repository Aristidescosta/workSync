import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

interface IWorkSyncModalProps {
    children: React.ReactNode
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle: string
}

export const WorkSyncModal = ({ children, isOpen, title, subtitle, onClose }: IWorkSyncModalProps) => {
    return (
        <Dialog onOpenChange={onClose} modal open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-lg text-left md:text-2xl'>{title}</DialogTitle>
                    <DialogDescription className='text-left text-xs md:text-md'>
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
