"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BrainCircuit, AudioWaveform, FileQuestion, MessageCircle, ArrowRight, Upload, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'AI Summaries',
    description: 'Get personalized summaries for any expertise level, from beginner to expert.',
  },
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: 'Interactive Mindmaps',
    description: 'Visualize complex concepts and their relationships with dynamic mindmaps.',
  },
  {
    icon: <AudioWaveform className="w-6 h-6" />,
    title: 'Audio Narration',
    description: 'Listen to research papers on the go with high-quality text-to-speech.',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Contextual Chatbot',
    description: 'Ask questions and get instant, context-aware answers about the paper.',
  },
  {
    icon: <FileQuestion className="w-6 h-6" />,
    title: 'Generated Quizzes',
    description: 'Test your understanding with AI-generated multiple-choice questions.',
  },
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'PDF Cross-Reference',
    description: 'Upload your research PDFs and discover related papers, citations, and cross-references using AI.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black/5 dark:bg-black/20">
          {/* Animated Background */}
          <div className="absolute inset-0 w-full h-full">
            <StarsBackground 
              starDensity={0.0003}
              minTwinkleSpeed={0.3}
              maxTwinkleSpeed={0.8}
            />
            <ShootingStars 
              minSpeed={8}
              maxSpeed={20}
              minDelay={400}
              maxDelay={1500}
              starColor="#22c55e"
              trailColor="#16a34a"
            />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10 flex flex-col items-center justify-center min-h-full">
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-accent/90 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight py-2"
              style={{ 
                textShadow: '0 0 40px rgba(34, 197, 94, 0.3), 0 0 80px rgba(34, 197, 94, 0.1)',
                filter: 'drop-shadow(0 4px 20px rgba(34, 197, 94, 0.2))'
              }}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              AstroBio Navigator
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl lg:text-3xl text-muted-foreground"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.9, 
                delay: 0.3, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
            >
              Unlock the secrets of space biology. Your AI-powered guide to complex research papers with interactive summaries and insights.
            </motion.p>
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/papers" className="inline-flex items-center px-8 py-3">
                    <span className="relative z-10 font-semibold">Explore Papers</span>
                    <motion.div
                      className="relative z-10 ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ x: 8 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Button hover effects */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/30 to-accent/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-lg"
                      initial={{ scale: 0, opacity: 1 }}
                      whileHover={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                </Button>
              </motion.div>
              
              {/* Secondary CTA for new feature */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild variant="outline" size="lg" className="border-accent/30 hover:border-accent hover:bg-accent/10 hover:text-accent text-foreground group relative overflow-hidden transition-all duration-300">
                  <Link href="/upload" className="inline-flex items-center px-6 py-3">
                    <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold transition-colors duration-300">Upload PDF</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating background elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-20 w-full flex justify-center z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-2 hidden md:block">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="p-2 rounded-full border border-accent/30 bg-background/10 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/50 transition-colors duration-300 cursor-pointer"
              onClick={() => {
                const featuresSection = document.querySelector('#features-section');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ChevronDown className="w-5 h-5 text-accent" />
            </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="w-full py-16 md:py-24 bg-muted/30 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simplifying Complex Science
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                We use cutting-edge AI to make dense scientific literature accessible to everyone.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className="h-full relative z-10"
                >
                  <Card className="h-full flex flex-col transition-all duration-300 border border-transparent cursor-pointer hover:-translate-y-1 hover:bg-accent/5 hover:border-accent/50 group" style={{ boxShadow: 'none' }}>
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: '0 0 15px 3px rgba(34, 197, 94, 0.12)' }} />
                    <CardHeader className="pb-4 relative z-10">
                      <div className="mb-3 p-3 w-fit rounded-xl bg-accent/10 group-hover:bg-accent/20 group-hover:scale-105 group-hover:ring-2 group-hover:ring-accent/30 transition-all duration-300">
                        <div className="text-accent group-hover:text-accent transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300 font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30 pointer-events-none -z-10">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </section>
      </main>
    </div>
  );
}