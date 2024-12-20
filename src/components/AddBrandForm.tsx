'use client'

import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { X } from 'lucide-react'
import { 
    type SustainableBrand, 
    type BrandContent,
    type BrandOrigin,
    Category,
    Certification
} from '@/lib/brands'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lockScroll, unlockScroll } from '@/utils/scrollLock'

interface AddBrandFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<SustainableBrand, 'id'>) => void;
}

interface FormState {
    brandName: string;
    website: string;
    submitterName: string;
    submitterEmail: string;
}

export function AddBrandForm({ isOpen, onClose, onSubmit }: AddBrandFormProps) {
    const [formData, setFormData] = useState<FormState>({
        brandName: '',
        website: '',
        submitterName: '',
        submitterEmail: '',
    })
    const nameInputRef = useRef<HTMLInputElement>(null)

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    useEffect(() => {
        if (isOpen && nameInputRef.current) {
            setTimeout(() => {
                nameInputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                brandName: '',
                website: '',
                submitterName: '',
                submitterEmail: '',
            })
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            lockScroll()
        } else {
            unlockScroll()
        }
    }, [isOpen])

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onClose()
    }

    const isFormValid = 
        formData.brandName.trim() !== '' && 
        formData.website.trim() !== '' &&
        formData.submitterName.trim() !== '' &&
        isValidEmail(formData.submitterEmail.trim())

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) return

        try {
            await emailjs.send(
                'service_if3r2ea',
                'template_pl8xkht',
                {
                    brand_name: formData.brandName,
                    website: formData.website,
                    submitter_name: formData.submitterName,
                    submitter_email: formData.submitterEmail
                },
                '5uu-8S9QOtsRdSZ3O'
            )
            
            const brandData: Omit<SustainableBrand, 'id'> = {
                name: formData.brandName,
                logo: '',
                cover: '',
                categories: [] as Category[],
                content: {
                    about: '',
                    impact: '',
                    sustainableFeatures: []
                } as BrandContent,
                url: formData.website,
                businessStartDate: new Date().toISOString(),
                images: [],
                founder: [],
                productRange: [],
                certifications: [] as Certification[],
                retailers: [],
                origin: {
                    city: '',
                    country: ''
                } as BrandOrigin
            }
            
            onSubmit(brandData)
            setFormData({
                brandName: '',
                website: '',
                submitterName: '',
                submitterEmail: '',
            })
            onClose()
            
            alert('Thank you for your submission!')
            
        } catch (error) {
            console.error('Failed to send email:', error)
            alert('Failed to submit form. Please try again.')
        }
    }

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
                    style={{ zIndex: 40 }} 
                    aria-hidden="true"
                />
            )}
            
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent 
                    className="sm:max-w-[525px] h-full sm:h-auto relative p-6 sm:p-6 data-[state=open]:sm:slide-in-from-bottom-0 fixed bottom-0 sm:bottom-auto sm:fixed sm:left-[50%] sm:top-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] overflow-y-auto max-w-full border-0 sm:border"
                    style={{ zIndex: 60 }}
                >
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-transparent"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>

                    <DialogHeader className="space-y-0 mb-0">
                        <DialogTitle className="text-2xl text-left break-words pt-20">Join the Eco Revolution</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm text-left">
                            Know an amazing eco-friendly brand? Help us spotlight the businesses making sustainability their mission.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="brandName" className="text-sm font-medium">
                                    Brand Name
                                    <span className="text-destructive"> *</span>
                                </Label>
                                <Input
                                    ref={nameInputRef}
                                    id="brandName"
                                    placeholder="Enter your brand name"
                                    value={formData.brandName}
                                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                                    className="rounded-lg focus-visible:ring-ring text-base"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="website" className="text-sm font-medium">
                                    Website URL
                                    <span className="text-destructive"> *</span>
                                </Label>
                                <Input
                                    id="website"
                                    type="text"
                                    placeholder="https://"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="rounded-lg focus-visible:ring-ring text-base bg-background text-foreground"
                                    style={{ 
                                        WebkitTextFillColor: 'currentcolor',
                                        fontSize: '16px'
                                    }}
                                    spellCheck="false"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="submitterName" className="text-sm font-medium">
                                    Your Name
                                    <span className="text-destructive"> *</span>
                                </Label>
                                <Input
                                    id="submitterName"
                                    placeholder="Enter your full name"
                                    value={formData.submitterName}
                                    onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                                    className="rounded-lg focus-visible:ring-ring text-base"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="submitterEmail" className="text-sm font-medium">
                                    Your Email
                                    <span className="text-destructive"> *</span>
                                </Label>
                                <Input
                                    id="submitterEmail"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.submitterEmail}
                                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                                    className="rounded-lg focus-visible:ring-ring text-base"
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-left">
                                Submit 50 verified eco-friendly brands to earn rewards. We&apos;ll track your progress via email.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="rounded-full px-8"
                                disabled={!isFormValid}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
