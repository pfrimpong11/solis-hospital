'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

const specialists = [
  { name: 'Cardiology' },
  { name: 'Neurology' },
  { name: 'Pediatrics' },
];

export default function UltimateCenteredHeroPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-sans">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-secondary/20 blur-3xl dark:bg-secondary/10" />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">SOLIS</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Button variant="ghost">Contact Us</Button>
              <ThemeToggle />
            </motion.div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            The Future of
            <br />
            <span className="text-primary">Personalized Health.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Experience a new era of healthcare. SOLIS combines world-class medical expertise with seamless technology to put you at the center of your wellness journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Our Specialties:</p>
            <div className="flex -space-x-4">
              {specialists.map((s, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-bold text-secondary-foreground shadow-lg"
                  title={s.name}
                >
                  {s.name.substring(0, 1)}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="group relative mt-10"
          >
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-secondary opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
            <Link href="/login" passHref>
              <Button size="lg" className="relative h-14 px-8 text-lg">
                Access Your Dashboard
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
