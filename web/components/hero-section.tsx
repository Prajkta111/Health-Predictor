'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import { Heart, Activity, Brain, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <StaggerContainer className="space-y-6 sm:space-y-8">
          {/* Greeting */}
          <StaggerItem>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-primary"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>AI Health Predictions</span>
            </motion.div>
          </StaggerItem>

          {/* Main Heading */}
          <StaggerItem>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                HealthPredictor
              </span>
            </h1>
          </StaggerItem>

          {/* Subtitle */}
          <StaggerItem>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Smart AI predictions for better health decisions
            </p>
          </StaggerItem>

          {/* Description */}
          <StaggerItem>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get instant health insights with our advanced machine learning models
            </p>
          </StaggerItem>

          {/* CTA Buttons */}
          <StaggerItem>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/predict">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
                >
                  Start Prediction
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full border-2 transition-all duration-300 hover:scale-105 hover:bg-accent/50 w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </StaggerItem>

          {/* Quick Stats */}
          <StaggerItem>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 sm:pt-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>4+ Disease Models</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Real-time Predictions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Clinical Grade Accuracy</span>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
