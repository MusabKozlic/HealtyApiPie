// app/contact/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ContactForm from "./ContactForm"

export default async function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Have questions or want to get in touch? Fill out the fields below and click Send Email to contact us directly.
          </p>

          {/* Emails */}
          <div className="flex flex-col md:flex-row justify-around mb-12 gap-6">
            <div className="bg-white/80 p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-gray-800">Support</h3>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-gray-800">Info</h3>
              <p className="text-gray-600">info@example.com</p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-md text-center">
              <h3 className="font-semibold text-gray-800">General</h3>
              <p className="text-gray-600">hello@example.com</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
