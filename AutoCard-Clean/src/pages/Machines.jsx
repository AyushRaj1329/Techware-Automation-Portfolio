import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import machines from "../data/machines.js";

const Machines = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar staticPosition />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <section className="section-container relative pb-20 md:pb-28">
          <Link to="/#machines" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="max-w-3xl mb-12">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-primary uppercase tracking-widest">
              Complete Machine Range
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-5">
              Automation Machines Built for <span className="gradient-text">Card Production</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg leading-relaxed">
              Explore Techware Automation India's machines for punching, inspection, feeding, validation, and quality control workflows.
            </motion.p>
          </div>

          <div className="grid gap-8">
            {machines.map((machine, index) => (
              <motion.article
                key={`${machine.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * index }}
                className="grid lg:grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-2xl bg-card border border-border card-shadow"
              >
                <div className="h-64 lg:h-full min-h-[300px] overflow-hidden">
                  <img src={machine.image} alt={machine.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">{machine.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{machine.desc}</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {machine.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 rounded-lg bg-secondary/70 px-4 py-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/#machines" className="inline-flex items-center gap-2 cta-gradient text-white font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition-opacity">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Machines;
