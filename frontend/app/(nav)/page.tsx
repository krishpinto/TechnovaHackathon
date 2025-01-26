"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, Zap, Check, Github, Twitter, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-950">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold text-white">ProjectAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Features
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Pricing
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              About
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2 mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-gray-300">Build for the future</span>
            <Button variant="ghost" size="sm" className="text-gray-300">
              What&apos;s new <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Kickstart Your Projects with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              AI-Powered Roadmaps
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12">
            Unlock your potential with our intuitive platform. Effortlessly generate project roadmaps
            tailored to your needs. Transform your ideas into reality and make your project journey
            seamless and enjoyable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8">
              Start for free
            </Button>
            <Button size="lg" variant="outline" className="text-gray-300 border-gray-700">
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Planning</h3>
            <p className="text-gray-400">
              Generate comprehensive project roadmaps using advanced AI algorithms tailored to your specific needs.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-gray-400">
              Track project progress and performance with intuitive dashboards and detailed metrics.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Seamless Integration</h3>
            <p className="text-gray-400">
              Connect with your favorite tools and workflows for a unified project management experience.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <p className="text-gray-400 mb-4">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> 3 projects
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Basic analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> 24/7 support
                </li>
              </ul>
              <Button className="w-full bg-red-500 hover:bg-red-600">Get Started</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-4">For growing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Unlimited projects
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Custom integrations
                </li>
              </ul>
              <Button className="w-full bg-red-500 hover:bg-red-600">Get Started</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-4">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Everything in Pro
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Custom AI models
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> Dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-red-500 mr-2" /> SLA guarantee
                </li>
              </ul>
              <Button className="w-full bg-red-500 hover:bg-red-600">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to streamline your workflow?
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-6">
            Start your free trial today.
          </h3>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of teams already using ProjectAI to boost their productivity.
          </p>
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8">
            Sign up for free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-red-500" />
                <span className="text-xl font-bold text-white">ProjectAI</span>
              </div>
              <p className="text-gray-400">
                Transform your project management with AI-powered tools and insights.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 ProjectAI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}