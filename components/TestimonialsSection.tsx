"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Business Owner, Mumbai",
    content:
      "Working with Systematic Investments has transformed my approach to financial planning. Their personalized advice and consistent follow-ups have helped me secure my family's future with confidence.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "IT Professional, Thane",
    content:
      "The team's dedication to understanding my goals and their transparent approach made all the difference. My portfolio has grown steadily, and I feel financially secure for the first time.",
    rating: 5,
  },
  {
    name: "Anil Kumar",
    role: "Retired Teacher, Pune",
    content:
      "After retirement, I was worried about my finances. Mr. Bhande and his team created a plan that gives me regular income while protecting my capital. Highly recommended!",
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="section-padding bg-background-secondary"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Client Stories
          </span>
          <h2 className="heading-lg mb-4">What Our Clients Say</h2>
          <p className="text-body max-w-2xl mx-auto">
            Real stories from families who have entrusted us with their financial 
            journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="card-elevated p-6 sm:p-8 relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />

              <div className="relative z-10">
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-accent/30" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-accent fill-accent"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-navy-700 leading-relaxed mb-6 italic">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-heading font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          <div className="text-center">
            <p className="text-3xl font-heading font-bold text-primary">4.9</p>
            <p className="text-sm text-muted">Average Rating</p>
          </div>
          <div className="hidden sm:block w-px bg-card-border" />
          <div className="text-center">
            <p className="text-3xl font-heading font-bold text-primary">98%</p>
            <p className="text-sm text-muted">Client Retention</p>
          </div>
          <div className="hidden sm:block w-px bg-card-border" />
          <div className="text-center">
            <p className="text-3xl font-heading font-bold text-primary">1000+</p>
            <p className="text-sm text-muted">Happy Families</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



