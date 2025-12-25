'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/app-layout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Link from 'next/link';

const plans = {
  monthly: [
    {
      id: 'free_v1',
      name: 'Free',
      price: '₹0',
      frequency: '/ month',
      description: 'For individuals starting out with AI code generation.',
      features: [
        'Up to 3 Flutter app generations per day',
        'Basic Flutter UI and navigation',
        'Export Flutter/Dart code',
        'Google Sign-In access',
        'Community support',
      ],
      cta: 'Start Free',
      popular: false,
      comingSoon: false,
      href: '/login'
    },
    {
      id: 'pro_v1_monthly',
      name: 'Pro',
      price: '₹0',
      frequency: '/ month',
      description: 'For professional developers who need unlimited power. (Limited Time Offer)',
      features: [
        'Unlimited Flutter app generations',
        'Advanced Flutter widgets',
        'Firebase Auth + Firestore scaffolding',
        'Cleaner, production-ready code',
        'Faster AI responses',
        'Priority support',
      ],
      cta: 'Get Pro for Free',
      popular: true,
      comingSoon: false,
      href: '/login'
    },
    {
      id: 'studio_v1_monthly',
      name: 'Studio',
      price: '₹0',
      frequency: '/ month',
      description: 'For teams that need collaborative tools and advanced features. (Limited Time Offer)',
      features: [
        'Everything in Pro',
        'Multi-project management',
        'Team access (up to 3 users)',
        'Advanced app templates',
        'Early access to new features',
      ],
      cta: 'Coming Soon',
      popular: false,
      comingSoon: true,
      href: '#'
    },
  ],
  yearly: [
    {
      id: 'free_v1_yearly',
      name: 'Free',
      price: '₹0',
      frequency: '/ year',
      description: 'For individuals starting out with AI code generation.',
      features: [
        'Up to 3 Flutter app generations per day',
        'Basic Flutter UI and navigation',
        'Export Flutter/Dart code',
        'Google Sign-In access',
        'Community support',
      ],
      cta: 'Start Free',
      popular: false,
      comingSoon: false,
      href: '/login'
    },
    {
      id: 'pro_v1_yearly',
      name: 'Pro',
      price: '₹0',
      frequency: '/ year',
      description: 'For professional developers who need unlimited power. (Limited Time Offer)',
      features: [
        'Unlimited Flutter app generations',
        'Advanced Flutter widgets',
        'Firebase Auth + Firestore scaffolding',
        'Cleaner, production-ready code',
        'Faster AI responses',
        'Priority support',
      ],
      cta: 'Get Pro for Free',
      popular: true,
      comingSoon: false,
      href: '/login'
    },
    {
      id: 'studio_v1_yearly',
      name: 'Studio',
      price: '₹0',
      frequency: '/ year',
      description: 'For teams that need collaborative tools and advanced features. (Limited Time Offer)',
      features: [
        'Everything in Pro',
        'Multi-project management',
        'Team access (up to 3 users)',
        'Advanced app templates',
        'Early access to new features',
      ],
      cta: 'Coming Soon',
      popular: false,
      comingSoon: true,
      href: '#'
    },
  ],
};

type BillingCycle = 'monthly' | 'yearly';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const currentPlans = plans[billingCycle];

  return (
    <AppLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold tracking-tight">Craftix AI Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Choose the right plan for your needs. Start for free and scale up as you grow. All prices in INR.
        </p>
        <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as BillingCycle)}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'flex flex-col relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
              plan.popular ? 'border-primary ring-2 ring-primary' : ''
            )}
          >
            {plan.popular && (
              <Badge
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1"
              >
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="font-headline tracking-normal">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.frequency}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="font-semibold">Features include:</p>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'} disabled={plan.comingSoon}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-muted-foreground text-sm">
        <p>You can cancel your subscription at any time.</p>
        <p>Existing users will always keep their original plan benefits and pricing.</p>
      </div>
    </AppLayout>
  );
}
