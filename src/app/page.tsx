"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BrainCircuit, AudioWaveform, FileQuestion, MessageCircle, ArrowRight, Upload, Search } from 'lucide-react';
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
    isNew: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-black/5 dark:bg-black/20">
          {/* Animated Background */}
          <div className="absolute inset-0 w-full h-full">
            <StarsBackground 
              starDensity={0.0003}
              minTwinkleSpeed={0.3}
              maxTwinkleSpeed={0.8}
            />
            <ShootingStars 
              minSpeed={6}
              maxSpeed={16}
              minDelay={800}
              maxDelay={3000}
              starColor="#22c55e"
              trailColor="#16a34a"
            />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              AstroBio Navigator
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
                <Button asChild variant="outline" size="lg" className="border-accent/30 hover:border-accent hover:bg-accent/10 text-foreground group relative overflow-hidden">
                  <Link href="/upload" className="inline-flex items-center px-6 py-3">
                    <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold">Upload PDF</span>
                    <motion.div 
                      className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      NEW
                    </motion.div>
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
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30 relative">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <Card className={`border-0 shadow-sm hover:shadow-2xl transition-all duration-500 h-full bg-background/50 backdrop-blur-sm hover:bg-background/90 relative overflow-hidden ${feature.isNew ? 'ring-2 ring-accent/20 hover:ring-accent/40' : ''}`}>
                    {/* New Feature Badge */}
                    {feature.isNew && (
                      <motion.div 
                        className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full"
                        initial={{ scale: 0, rotate: -45 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        NEW
                      </motion.div>
                    )}
                    
                    <CardHeader className="pb-4 relative z-10">
                      <motion.div 
                        className={`mb-3 p-3 w-fit rounded-xl ${feature.isNew ? 'bg-accent/20' : 'bg-accent/10'} group-hover:bg-accent/30 transition-colors duration-300`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <motion.div
                          whileHover={{ rotateY: 180 }}
                          transition={{ duration: 0.6 }}
                        >
                          {feature.icon}
                        </motion.div>
                      </motion.div>
                      <CardTitle className={`text-xl group-hover:text-accent transition-colors duration-300 ${feature.isNew ? 'text-accent' : ''}`}>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-sm leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    
                    {/* Enhanced hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      initial={false}
                    />
                    
                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    {/* Pulse effect for new feature */}
                    {feature.isNew && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-accent/30"
                        animate={{ 
                          scale: [1, 1.02, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </section>
      </main>
    </div>
  );
}