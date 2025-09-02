"use client"

import { useState } from "react"
import { ArrowLeft, Check, Star, Zap, Crown, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const plans = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for individuals getting started with health predictions",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "5 predictions per month",
      "Basic health insights",
      "Email support",
      "Mobile app access",
      "Health history tracking",
    ],
    limitations: ["Limited prediction categories", "Basic recommendations"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for serious health monitoring",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/50",
    monthlyPrice: 29,
    yearlyPrice: 290,
    popular: true,
    features: [
      "Unlimited predictions",
      "Advanced AI insights",
      "Priority support",
      "Detailed health reports",
      "Trend analysis",
      "Custom recommendations",
      "Export data (PDF/CSV)",
      "Family account sharing",
    ],
    limitations: [],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Complete health ecosystem for professionals and families",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    monthlyPrice: 59,
    yearlyPrice: 590,
    features: [
      "Everything in Pro",
      "Personalized health coaching",
      "24/7 phone support",
      "Integration with wearables",
      "Advanced analytics dashboard",
      "Multi-user management",
      "API access",
      "White-label options",
      "Dedicated account manager",
    ],
    limitations: [],
  },
]

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false)

  const handleSubscribe = (planId: string) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${planId} plan`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Unlock the full potential of AI-powered health predictions. Select the plan that best fits your needs and
            start your journey to better health insights.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Yearly
            </Label>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Save 17%</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const savings = isYearly ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0

            return (
              <Card
                key={plan.id}
                className={`glass border-border/50 shadow-2xl transition-all duration-300 hover:scale-105 relative ${
                  plan.popular ? "ring-2 ring-primary/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 rounded-xl ${plan.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="font-serif text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                    </div>
                    {isYearly && savings > 0 && <p className="text-sm text-green-500 mt-2">Save ${savings} per year</p>}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    }`}
                  >
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </Button>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wide">Features Included</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                          Limitations
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-4 h-4 border border-muted-foreground/30 rounded-full mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="glass border-border/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                  billing cycle.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day free trial for all new users. No credit card required to get started.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Enterprise Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Need a custom solution for your healthcare organization? We offer enterprise packages with:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated support team</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">On-premise deployment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">HIPAA compliance</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="glass rounded-2xl p-8 border-border/50 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your needs. Get in touch with us for personalized
            recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="glass hover:glass-dark transition-all duration-300 bg-transparent">
              Schedule a Demo
            </Button>
            <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
