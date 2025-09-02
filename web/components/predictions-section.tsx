'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollReveal, StaggerContainer, StaggerItem, ScaleOnHover } from '@/components/animations';
import { Heart, Activity, Brain, Stethoscope, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const predictions = [
  {
    id: 'diabetes',
    title: 'Diabetes Prediction',
    description: 'Early detection of diabetes risk using glucose levels, BMI, and other clinical factors.',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-400',
    features: ['Glucose analysis', 'BMI assessment', 'Family history', 'Age factors'],
    href: '/predict/diabetes'
  },
  {
    id: 'heart-disease',
    title: 'Heart Disease Risk',
    description: 'Cardiovascular risk assessment based on cholesterol, blood pressure, and lifestyle factors.',
    icon: Heart,
    gradient: 'from-red-500 to-pink-400',
    features: ['Blood pressure', 'Cholesterol levels', 'ECG analysis', 'Exercise habits'],
    href: '/predict/heart-disease'
  },
  {
    id: 'parkinsons',
    title: 'Parkinson\'s Detection',
    description: 'Neural assessment for early signs of Parkinson\'s disease through voice analysis.',
    icon: Brain,
    gradient: 'from-purple-500 to-violet-400',
    features: ['Voice analysis', 'Motor symptoms', 'Tremor detection', 'Speech patterns'],
    href: '/predict/parkinsons'
  },
  {
    id: 'common-diseases',
    title: 'General Health',
    description: 'Comprehensive health screening using multiple biomarkers and symptoms.',
    icon: Stethoscope,
    gradient: 'from-green-500 to-emerald-400',
    features: ['Multi-factor analysis', 'Symptom correlation', 'Risk stratification', 'Health score'],
    href: '/predict/common-diseases'
  }
];

export function PredictionsSection() {
  return (
    <section id="predictions" className="py-16 sm:py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6"
            >
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>AI-Powered Predictions</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Health Predictions
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced machine learning models trained on clinical datasets to provide 
              accurate health risk assessments and early disease detection.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {predictions.map((prediction, index) => {
            const IconComponent = prediction.icon;
            
            return (
              <StaggerItem key={prediction.id}>
                <ScaleOnHover scale={1.02}>
                  <Link href={prediction.href} className="block h-full">
                    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full cursor-pointer">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${prediction.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <CardHeader className="relative pb-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${prediction.gradient} text-white mb-3 sm:mb-4`}>
                            <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                          </div>
                          
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="hidden sm:block"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="group/btn opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 pointer-events-none"
                              onClick={(e) => e.preventDefault()}
                            >
                              Try Now
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        <CardTitle className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                          {prediction.title}
                        </CardTitle>
                        
                        <CardDescription className="text-base sm:text-lg leading-relaxed">
                          {prediction.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground mb-3">
                            Key Features
                          </h4>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                          >
                            {prediction.features.map((feature, featureIndex) => (
                              <motion.div
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 + featureIndex * 0.05 }}
                                viewport={{ once: true }}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          viewport={{ once: true }}
                          className="mt-6"
                        >
                          <Button
                            className={`w-full group/btn bg-gradient-to-r ${prediction.gradient} hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base py-2 sm:py-3 pointer-events-none`}
                            onClick={(e) => e.preventDefault()}
                          >
                            Start Prediction
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScaleOnHover>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom CTA */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-primary/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Need a Custom Health Assessment?
              </h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Contact us for specialized health predictions tailored to your specific needs and medical requirements.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="bg-background hover:bg-accent/50 border-2 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
