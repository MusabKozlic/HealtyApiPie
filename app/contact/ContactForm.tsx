// app/contact/ContactForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactForm() {
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const handleSendEmail = () => {
        const mailto = `mailto:support@nutriaigenius.com?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(message)}`
        window.location.href = mailto
    }

    return (
        <div className="bg-white/80 p-8 rounded-xl shadow-md">
            <div className="grid gap-6">
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        placeholder="Subject of your message"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        placeholder="Type your message here"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSendEmail}
                >
                    Send Email
                </Button>
            </div>
        </div>
    )
}
