import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";
import { Bug, Camera, BarChart3, Shield } from "lucide-react";

const HomePageContent = () => {
  return (
    <>
      <Head>
        <title>CyberBugs - Track Bugs. Ship Faster.</title>
        <meta
          name="description"
          content="CyberBugs is the bug tracking system built for modern dev teams."
        />
      </Head>

      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800" />
          
          {/* Content */}
          <Container className="relative py-24 md:py-32" FULL={false}>
            <div className="text-center max-w-3xl mx-auto">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg">
                  <Bug className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    CyberBugs
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
                Track Bugs.{" "}
                <span className="text-blue-600">Ship Faster.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10">
                CyberBugs is the bug tracking system built for modern dev teams.
              </p>

              {/* CTA Button */}
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900">
          <Container className="" FULL={false}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Simple, powerful tools to manage your bug tracking workflow.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Camera className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Report Issues
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Testers submit bugs with screenshots and video links. Capture
                  every detail needed to reproduce and fix issues quickly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Track Progress
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  See bug status, severity, and trends at a glance. Dashboard
                  metrics help you prioritize and ship with confidence.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Role-Based Access
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Admins, testers, and developers see exactly what they need.
                  Secure, focused workflows for every team member.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <Container className="" FULL={false}>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400">
                © 2026 CyberBugs. Built by{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Cyberize
                </span>
                .
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default HomePageContent;
