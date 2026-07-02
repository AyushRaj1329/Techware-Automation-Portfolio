import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import serviceAutomation from "../assets/IA.jpg";
import serviceMachineDev from "../assets/service-machine-dev.jpg";
import serviceCardValidation from "../assets/service-card-validation.jpg";
import serviceEmbedded from "../assets/service-embedded.jpg";
import serviceMaintenance from "../assets/service-maintenance.jpg";
import plcIntregation from "../assets/PLC.jpg"
import serviceRefurbishment from "../assets/Refurbishment.jpg"
import serviceSpare from "../assets/spare.jpg"
const services = [
  {
    image: serviceAutomation, title: "Industrial Automation",
    desc: "Automated solutions to optimize industrial processes and productivity."
  },
  {
    image: serviceMachineDev, title: "Custom Machine Development",
    desc: "Design and manufacturing of specialized testing and automation machines."
  },
  {
    image: serviceCardValidation, title: "Card Validation Solutions",
    desc: "Advanced card testing and validation equipment."
  },
  { image: serviceEmbedded, title: "Custom Software Solutions", desc: "Custom software solutions for industrial automation and monitoring." },
  { image: serviceMaintenance, title: "Machine Maintenance & Support", desc: "Comprehensive maintenance and technical support services." },
  { image: plcIntregation, title: "PLC Integration & Programming", desc: "PLC programming, HMI development, SCADA integration, and industrial communication solutions." },
  { image: serviceRefurbishment, title: "Machine Refurbishment", desc: "Machine upgrades, repairs, and performance enhancement." },
 {
  image: serviceSpare,
   title: "Spare & Sealing Parts",
  desc: "Precision components for industrial machinery."
}
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding relative">
      <div className="section-container relative" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="text-sm font-semibold text-primary uppercase tracking-widest">Our Services</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            What We <span className="gradient-text">Offer</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg">
            Comprehensive automation capabilities from design to deployment
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 * i }} className="group relative rounded-2xl overflow-hidden h-72 card-shadow hover:card-shadow-hover transition-shadow duration-300">
              <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
