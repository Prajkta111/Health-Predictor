import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import { ModernNavbar } from '@/components/modern-navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-primary mb-6">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Get in Touch</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Contact Us
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Have questions or need support? We're here to help.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <ScrollReveal>
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">Send us a Message</CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input placeholder="Your first name" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input placeholder="Your last name" className="w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your.email@example.com" className="w-full" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="What's this about?" className="w-full" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..."
                      className="w-full min-h-[120px]"
                    />
                  </div>
                  
                  <Button className="w-full group bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02]">
                    Send Message
                    <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Contact Information */}
            <div className="space-y-8">
              <ScrollReveal>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                    Whether you have questions about our AI health predictions, need technical support, 
                    or want to explore partnership opportunities, our team is here to help.
                  </p>
                </div>
              </ScrollReveal>

              <StaggerContainer className="space-y-6">
                <StaggerItem>
                  <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                        <p className="text-muted-foreground mb-2">Send us an email anytime</p>
                        <p className="text-primary font-medium">support@healthpredictor.ai</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                        <p className="text-muted-foreground mb-2">Available Monday to Friday</p>
                        <p className="text-primary font-medium">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                        <p className="text-muted-foreground mb-2">Monday - Friday: 9:00 AM - 6:00 PM (PST)</p>
                        <p className="text-muted-foreground">Weekend: Emergency support only</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="p-6 border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Location</h3>
                        <p className="text-muted-foreground mb-2">San Francisco, CA</p>
                        <p className="text-muted-foreground">Remote-first company</p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Quick answers to common questions about our AI health prediction platform.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <StaggerItem>
              <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl mb-3">How accurate are the predictions?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI models achieve 95%+ accuracy rates, validated against clinical datasets and 
                  continuously updated with the latest medical research.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl mb-3">Is my health data secure?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we use end-to-end encryption and follow HIPAA compliance standards. 
                  Your data is never stored or shared without your explicit consent.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl mb-3">Can I use this for medical diagnosis?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our predictions are for informational purposes only and should not replace 
                  professional medical advice. Always consult with healthcare professionals.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-6 sm:p-8 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <h3 className="font-bold text-lg sm:text-xl mb-3">Do you offer API access?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we provide API access for healthcare organizations and researchers. 
                  Contact us to discuss integration and pricing options.
                </p>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
