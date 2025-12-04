"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Headphones, UserCheck, Linkedin, Mail, Star, Quote } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Seema Kawade",
    role: "Service Executive",
    tagline: "Client Relations Expert",
    description:
      "Service Executive focused on addressing client queries and ensuring seamless service.",
    icon: Headphones,
  },
  {
    name: "Rakesh Jadhav",
    role: "Service Executive",
    tagline: "Operations Specialist",
    description:
      "Service Executive dedicated to reliable, responsive servicing and operational support.",
    icon: UserCheck,
  },
];

export const TeamSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark rounded-full text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="heading-lg mb-4">Meet Your Financial Partners</h2>
          <p className="text-body max-w-2xl mx-auto">
            Meet the experts who are committed to securing your financial future 
            with personalized guidance and unwavering support.
          </p>
        </motion.div>

        {/* Founder Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary rounded-3xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12">
              {/* Founder Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative max-w-md mx-auto lg:mx-0">
                  {/* Image container with decorative border */}
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-accent via-accent-light to-accent rounded-3xl opacity-20 blur-sm" />
                    <div className="relative bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-2">
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-primary-dark">
                        <Image
                          src="/images/Founder1.png"
                          alt="Vivek Bhande - Founder"
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 100vw, 400px"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="absolute -bottom-4 -right-4 lg:right-auto lg:-left-4 bg-white rounded-2xl shadow-elevated p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-heading font-bold text-primary">25+</p>
                        <p className="text-xs text-muted">Years Experience</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Founder Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="order-1 lg:order-2"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-primary text-sm font-semibold rounded-full">
                    <Award className="w-4 h-4" />
                    Founder
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                </div>

                <h3 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">
                  Vivek Bhande
                </h3>
                <p className="text-lg text-accent mb-2">Founder, Systematic Investments</p>
                <p className="text-white/70 mb-6">Family&apos;s Financial Expert</p>

                <p className="text-white/80 leading-relaxed mb-6 text-lg">
                  Vivek Bhande is a Family&apos;s Financial Expert at Systematic Investments 
                  dedicated to empowering individuals to make wise financial decisions. With a 
                  focus on prioritizing goals and optimizing resources, he helps clients take 
                  proactive steps toward financial success.
                </p>

                {/* Quote */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/10">
                  <Quote className="w-8 h-8 text-accent/40 absolute top-4 right-4" />
                  <p className="text-white/90 italic pr-8">
                    &quot;Since 1996, my mission has been to help families achieve financial 
                    independence through disciplined planning and trusted guidance.&quot;
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-2xl font-heading font-bold text-accent">1000+</p>
                    <p className="text-xs text-white/60">Clients Served</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-2xl font-heading font-bold text-accent">25 Cr+</p>
                    <p className="text-xs text-white/60">AUM</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-2xl font-heading font-bold text-accent">500+</p>
                    <p className="text-xs text-white/60">Claims Settled</p>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-3">
                  <motion.a
                    href="mailto:viv.bhande@gmail.com"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-white group-hover:text-primary" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors group"
                  >
                    <Linkedin className="w-5 h-5 text-white group-hover:text-primary" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section title for team members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="heading-sm text-primary">Our Dedicated Support Team</h3>
          <p className="text-body-sm mt-2">Ensuring seamless service and support for all your financial needs</p>
        </motion.div>

        {/* Other Team Members */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
              whileHover={{ y: -5 }}
              className="card-elevated overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="h-20 bg-gradient-to-br from-navy-700 to-navy-900 relative">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
                      backgroundSize: "16px 16px",
                    }}
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="flex justify-center -mt-10 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-elevated border-4 border-white">
                  <member.icon className="w-9 h-9 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-4 text-center">
                <h3 className="text-xl font-heading font-semibold text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-accent mb-1">{member.role}</p>
                <p className="text-xs text-muted mb-4">{member.tagline}</p>

                <p className="text-body-sm leading-relaxed">{member.description}</p>

                {/* Social links placeholder */}
                <div className="flex justify-center gap-3 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors group"
                  >
                    <Linkedin className="w-4 h-4 text-primary group-hover:text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors group"
                  >
                    <Mail className="w-4 h-4 text-primary group-hover:text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
