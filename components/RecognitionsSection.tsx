"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, CheckCircle, GraduationCap, Heart, Star } from "lucide-react";

const impacts = [
  {
    icon: Award,
    stat: "200+",
    title: "Clients Achieved Their Goals",
    description:
      "Assisted more than 200 clients in achieving their financial goals and planning for education, marriage, and retirement.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: CheckCircle,
    stat: "500+",
    title: "Claims Settled Successfully",
    description:
      "Settled more than 500 claims successfully, ensuring our clients received timely support during critical moments.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: GraduationCap,
    stat: "21",
    title: "Years of Planning Success",
    description:
      "Planned an education journey for a 3-year-old girl; she has now completed her post-graduation, secured a job, and started her own investments.",
    color: "from-accent to-accent-light",
  },
];

export const RecognitionsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="recognitions" ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
            Our Impact
          </span>
          <h2 className="heading-lg mb-4">Recognitions & Real-Life Impact</h2>
          <p className="text-body max-w-2xl mx-auto">
            Stories of success and the real difference we&apos;ve made in our clients&apos; lives 
            over the years.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="card-elevated overflow-hidden group"
            >
              {/* Gradient header */}
              <div className={`h-2 bg-gradient-to-r ${impact.color}`} />

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <impact.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-accent fill-accent"
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-heading font-bold text-primary">
                    {impact.stat}
                  </span>
                  <span className="text-lg font-heading text-accent ml-1">+</span>
                </div>

                <h3 className="text-lg font-heading font-semibold text-primary mb-3">
                  {impact.title}
                </h3>

                <p className="text-body-sm leading-relaxed">{impact.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom testimonial highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full">
            <Heart className="w-5 h-5 text-accent" />
            <span className="text-navy-700 font-medium">
              Building lasting relationships through trust and results
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



