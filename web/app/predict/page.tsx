import { PredictionsSection } from '@/components/predictions-section';
import { ModernNavbar } from '@/components/modern-navbar';

export default function PredictPage() {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      {/* Simple header */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Health Predictions</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose a prediction model to get instant health insights
            </p>
          </div>
        </div>
      </section>

      {/* Predictions Section */}
      <PredictionsSection />
    </div>
  );
}
