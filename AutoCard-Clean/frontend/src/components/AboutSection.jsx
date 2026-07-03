
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Cpu, Settings, Target } from "lucide-react";

const pillars = [
  {
    icon: Cpu,
    title: "Industrial Automation",
    desc: "Advanced automation solutions designed to improve productivity, reduce downtime, and optimize manufacturing processes.",
  },
  {
    icon: Shield,
    title: "Quality & Reliability",
    desc: "Every machine undergoes rigorous testing and validation to ensure long-term performance and operational reliability.",
  },
  {
    icon: Settings,
    title: "Custom Machine Development",
    desc: "Specialized machines engineered to meet unique production requirements across various industrial sectors.",
  },
  {
    icon: Target,
    title: "PLC & Software Integration",
    desc: "Seamless PLC, HMI, SCADA, and software integration for intelligent monitoring, control, and data management.",
  },
];

const AboutSection = () => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      <div
        className="section-container relative"
        ref={ref}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold text-primary uppercase tracking-widest"
            >
              About Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-6"
            >
              Driving Innovation Through{" "}
              <span className="gradient-text">
                Industrial Automation
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-4"
            >
              Techware Automation INDIA specializes in industrial
              automation, custom machine development, PLC
              integration, card validation systems,
              and software solutions. We help manufacturers
              improve efficiency, accuracy, and production
              reliability through innovative engineering.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground leading-relaxed mb-8"
            >
              From concept and design to deployment and
              maintenance, our team delivers scalable
              automation systems tailored to meet the
              evolving needs of modern industries.
            </motion.p>

            
          </div>

          {/* Right Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.1,
                }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-shadow group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="font-display font-semibold text-lg mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

