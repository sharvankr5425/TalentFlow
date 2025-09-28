import { motion } from 'framer-motion';
import { Briefcase, BarChart2, FileText, ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
  >
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </motion.div>
);

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600 h-7 w-7" />
            <span className="text-2xl font-bold text-gray-800">TalentFlow</span>
          </div>
          <Link to="/app">
            <Button>Go to App</Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              The Modern Hiring Platform
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Streamline your recruitment process from job posting to hiring with our intuitive, all-in-one platform.
            </p>
            <Link to="/app">
              <Button className="text-lg px-8 py-3">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <FeatureCard 
                icon={<Briefcase size={24} />}
                title="Manage Jobs"
                description="Create, edit, and organize job postings with ease. Keep track of your open roles and candidate flow."
              />
              <FeatureCard 
                icon={<FileText size={24} />}
                title="Custom Assessments"
                description="Build job-specific assessments with multiple question types to evaluate candidates effectively."
              />
              <FeatureCard 
                icon={<BarChart2 size={24} />}
                title="Analytics Dashboard"
                description="Gain insights into your hiring pipeline with a powerful dashboard and reporting tools."
              />
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
