import { ModernNavbar } from "@/components/modern-navbar"
import { HeroSection } from "@/components/hero-section"
import { PredictionsSection } from "@/components/predictions-section"
import { Heart, Activity, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      
      <main>
        <HeroSection />
        <PredictionsSection />
        
        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Why HealthPredictor?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced AI technology for accurate health insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center p-6 sm:p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Advanced AI</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  State-of-the-art machine learning models trained on extensive medical datasets for accurate predictions.
                </p>
              </div>
              
              <div className="text-center p-6 sm:p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Personalized</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Tailored health predictions based on your unique profile, risk factors, and medical history.
                </p>
              </div>
              
              <div className="text-center p-6 sm:p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Clinically Validated</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Results backed by clinical research and validated by medical professionals for reliability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">
                  Health<span className="text-primary">Predictor</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6 text-sm sm:text-base">
                Empowering individuals with AI-driven health insights for better decision making and preventive care.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                <li><Link href="/predict" className="hover:text-foreground transition-colors">Predictions</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/subscription" className="hover:text-foreground transition-colors">Pro</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-6 sm:pt-8 mt-6 sm:mt-8 text-center text-muted-foreground text-sm sm:text-base">
            <p>&copy; 2024 HealthPredictor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
