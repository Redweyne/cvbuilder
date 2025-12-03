import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Sparkles,
  Zap,
  Crown,
  FileText,
  Target,
  Download,
  Wand2,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '3 CV exports per month',
      '5 AI enhancements',
      '2 basic templates',
      'Basic ATS optimization',
      'Email support'
    ],
    limits: {
      exports: 3,
      ai_credits: 5,
      templates: 2
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'month',
    description: 'For serious job seekers',
    popular: true,
    features: [
      'Unlimited CV exports',
      '50 AI enhancements per month',
      'All premium templates',
      'Advanced ATS optimization',
      'Job matching & tailoring',
      'Cover letter generation',
      'Priority support'
    ],
    limits: {
      exports: 999,
      ai_credits: 50,
      templates: 999
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29,
    period: 'month',
    description: 'For power users & teams',
    features: [
      'Everything in Pro',
      'Unlimited AI enhancements',
      'Custom branding',
      'API access',
      'Team collaboration',
      'Dedicated account manager',
      'Custom integrations'
    ],
    limits: {
      exports: 999,
      ai_credits: 999,
      templates: 999
    }
  }
];

export default function Billing() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {
      base44.auth.redirectToLogin();
    }
  };

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const subs = await base44.entities.UserSubscription.filter({ created_by: user?.email }, '-created_date', 1);
      return subs[0] || { plan: 'free', ai_credits_used: 2, ai_credits_limit: 5, exports_used: 1, exports_limit: 3 };
    },
    enabled: !!user,
  });

  const currentPlan = plans.find(p => p.id === subscription?.plan) || plans[0];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing & Plans</h1>
        <p className="text-slate-600 mt-1">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-sm mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Current Plan
              </CardTitle>
              <CardDescription>Your current subscription and usage</CardDescription>
            </div>
            <Badge className={`${currentPlan.id === 'free' ? 'bg-slate-100 text-slate-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <Wand2 className="w-4 h-4" />
                  AI Credits
                </span>
                <span className="font-medium">
                  {subscription?.ai_credits_used || 0}/{subscription?.ai_credits_limit || 5}
                </span>
              </div>
              <Progress 
                value={((subscription?.ai_credits_used || 0) / (subscription?.ai_credits_limit || 5)) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  PDF Exports
                </span>
                <span className="font-medium">
                  {subscription?.exports_used || 0}/{subscription?.exports_limit || 3}
                </span>
              </div>
              <Progress 
                value={((subscription?.exports_used || 0) / (subscription?.exports_limit || 3)) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Billing Period</span>
                <span className="font-medium">
                  {subscription?.billing_cycle || 'N/A'}
                </span>
              </div>
              {subscription?.next_billing_date && (
                <p className="text-xs text-slate-500">
                  Next billing: {subscription.next_billing_date}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`relative h-full border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-indigo-600 shadow-xl shadow-indigo-500/20' 
                  : selectedPlan === plan.id 
                    ? 'border-indigo-300 shadow-lg' 
                    : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white px-3">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    plan.id === 'free' ? 'bg-slate-100' :
                    plan.id === 'pro' ? 'bg-indigo-100' :
                    'bg-gradient-to-br from-amber-100 to-yellow-100'
                  }`}>
                    {plan.id === 'free' && <Zap className="w-6 h-6 text-slate-600" />}
                    {plan.id === 'pro' && <Sparkles className="w-6 h-6 text-indigo-600" />}
                    {plan.id === 'enterprise' && <Crown className="w-6 h-6 text-amber-600" />}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    currentPlan.id === plan.id 
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-100 cursor-default'
                      : plan.popular 
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  disabled={currentPlan.id === plan.id}
                >
                  {currentPlan.id === plan.id ? 'Current Plan' : 
                   plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <Card className="border-0 shadow-sm mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 mb-1">Can I cancel anytime?</h4>
            <p className="text-sm text-slate-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 mb-1">What happens to my CVs if I downgrade?</h4>
            <p className="text-sm text-slate-600">Your CVs are always saved. You'll just have limited access to premium templates and AI features on the free plan.</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 mb-1">Do unused credits roll over?</h4>
            <p className="text-sm text-slate-600">AI credits reset each month. We recommend using them before your billing cycle ends.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}