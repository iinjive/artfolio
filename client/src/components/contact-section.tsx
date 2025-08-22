import { motion } from "framer-motion";

// Local SVG Icons
const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l-4 4 6 6 4-16-18 7 4 2 8-4"/>
  </svg>
);

export default function ContactSection() {
  const contacts = [
    {
      name: "Email",
      icon: EmailIcon,
      color: "text-accent-500",
      hoverColor: "group-hover:text-accent-500",
      underlineColor: "bg-accent-500",
      value: "raevski.art@gmail.com",
      href: "mailto:raevski.art@gmail.com"
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      color: "text-blue-500",
      hoverColor: "group-hover:text-blue-500",
      underlineColor: "bg-blue-500",
      value: "@RAEVSKI_ART",
      href: "https://t.me/RAEVSKI_ART"
    }
  ];

  return (
    <section id="contact" className="py-20 px-6 border-t border-dark-700">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-title font-bold mb-8 text-slate-100"
          data-testid="text-contact-title"
        >
          Let's Create Together
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl font-title text-slate-400 mb-12 max-w-2xl mx-auto"
          data-testid="text-contact-subtitle"
        >
          Ready to bring your vision to life? Get in touch to discuss your next project.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={contact.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="contact-link group block"
              data-testid={`link-${contact.name.toLowerCase()}`}
            >
              <div className="glass-effect rounded-xl p-6 hover:bg-glass-border transition-all duration-300">
                <div className={`text-2xl ${contact.color} mb-3 flex justify-center`}>
                  <contact.icon />
                </div>
                <h3 className="text-lg font-semibold mb-2">{contact.name}</h3>
                <p className={`text-sm text-slate-400 ${contact.hoverColor} transition-colors`}>
                  {contact.value}
                </p>
                <div className={`w-0 group-hover:w-full h-0.5 ${contact.underlineColor} transition-all duration-300 mx-auto mt-3`}></div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
