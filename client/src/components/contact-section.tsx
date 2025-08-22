import { motion } from "framer-motion";

export default function ContactSection() {
  const contacts = [
    {
      name: "Email",
      icon: "fas fa-envelope",
      color: "text-accent-500",
      hoverColor: "group-hover:text-accent-500",
      underlineColor: "bg-accent-500",
      value: "raevski.art@gmail.com",
      href: "mailto:raevski.art@gmail.com"
    },
    {
      name: "Telegram",
      icon: "fab fa-telegram",
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
                <div className={`text-2xl ${contact.color} mb-3`}>
                  <i className={contact.icon}></i>
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
