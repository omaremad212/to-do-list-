'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  ArrowRightIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  CloudIcon,
  PaintBrushIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: <BoltIcon className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Built with Next.js 14 for blazing performance and instant page loads.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Enterprise Security',
    description: 'Industry-leading encryption and secure authentication protect your data.',
  },
  {
    icon: <CloudIcon className="w-6 h-6" />,
    title: 'Cloud Sync',
    description: 'Your tasks sync automatically across all devices in real-time.',
  },
  {
    icon: <PaintBrushIcon className="w-6 h-6" />,
    title: 'Beautiful Design',
    description: 'Modern interface with smooth animations and stunning visuals.',
  },
  {
    icon: <UserGroupIcon className="w-6 h-6" />,
    title: 'Team Collaboration',
    description: 'Share tasks with team members and collaborate on projects.',
  },
  {
    icon: <ChartBarIcon className="w-6 h-6" />,
    title: 'Advanced Analytics',
    description: 'Track productivity metrics and understand your work patterns.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Account',
    description: 'Sign up in seconds with your email.',
  },
  {
    step: '02',
    title: 'Add Tasks',
    description: 'Quickly add tasks with priorities and due dates.',
  },
  {
    step: '03',
    title: 'Get Things Done',
    description: 'Complete tasks and track your progress.',
  },
  {
    step: '04',
    title: 'Achieve More',
    description: 'See your productivity soar and accomplish goals.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'TaskFlow completely changed my daily workflow. Beautiful interface and powerful features - best task manager I have ever used.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'The Demo mode let me try the product instantly. Now my entire team uses TaskFlow every day.',
    rating: 5,
  },
  {
    name: 'Emily Wong',
    role: 'Designer at CreativeStudio',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d71?w=100&h=100&fit=crop',
    content: 'The design is absolutely stunning. It makes organizing my tasks actually enjoyable.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for individuals getting started',
    features: [
      'Up to 50 tasks',
      'Basic priorities',
      'Dark mode',
      'Mobile access',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '9',
    description: 'For professionals who want more',
    features: [
      'Unlimited tasks',
      'Advanced priorities',
      'Team collaboration',
      'Analytics dashboard',
      'Priority support',
      'Custom themes',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '19',
    description: 'For teams collaborating on projects',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team analytics',
      'Admin controls',
      'Shared workspaces',
      'Dedicated support',
      'SSO integration',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How does the Demo mode work?',
    answer: 'Demo mode gives you instant access to explore all features with pre-populated sample data. No account required - just click and start experiencing the product.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-leading encryption and secure authentication. Your data is stored in encrypted databases and never shared with anyone.',
  },
  {
    question: 'Can I switch from Demo to a real account?',
    answer: 'Yes! Any time during Demo mode, you can sign up and your demo data will be preserved in your new account.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Yes! TaskFlow works on all devices - web, mobile, and tablet. Your tasks sync automatically across all platforms.',
  },
  {
    question: 'How much does it cost?',
    answer: 'TaskFlow has a generous free plan. Upgrade to Pro for unlimited tasks and advanced features.',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '1M+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">TaskFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login?demo=true"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-8">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span>Over 50,000 users worldwide</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-white">Get More Done with</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  TaskFlow
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                The modern task management tool that helps you focus on what truly matters. 
                Beautiful design, powerful features, and an instant Demo mode to explore before you sign up.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  href="/login?demo=true"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <BoltIcon className="w-5 h-5" />
                  Try Free Demo
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-800">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 h-20 bottom-0" />
            <div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl">
              <div className="h-10 bg-slate-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="ml-auto text-xs text-slate-500">TaskFlow Dashboard</div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { title: 'Complete Product Requirements Doc', priority: 'high', completed: false, dueDate: 'Today' },
                  { title: 'Review UI Design Mockups', priority: 'medium', completed: true, dueDate: 'Yesterday' },
                  { title: 'Team Meeting Prep', priority: 'low', completed: false, dueDate: 'Tomorrow' },
                  { title: 'Code Review PR #42', priority: 'high', completed: false, dueDate: 'Today' },
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                    <div className={`w-5 h-5 rounded border-2 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                      {task.completed && <CheckIcon className="w-full h-full text-white p-0.5" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-slate-500">{task.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features, Simple Experience
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Every feature is designed to maximize your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-slate-400">
              You will be up and running in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-indigo-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-slate-400">
              Real feedback from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-slate-800/50 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <StarIcon key={j} className="w-5 h-5 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl border ${
                  plan.popular
                    ? 'bg-indigo-600 border-indigo-500'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="text-xs font-medium bg-white text-indigo-600 px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300">
                      <CheckIcon className="w-5 h-5 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`w-full py-3 rounded-xl font-medium text-center block transition-colors ${
                    plan.popular
                      ? 'bg-white text-indigo-600 hover:bg-slate-100'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ArrowRightIcon className={`w-5 h-5 text-slate-400 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Start with the free Demo and experience TaskFlow instantly
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?demo=true"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Try Free Demo
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2024 TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">TaskFlow</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}