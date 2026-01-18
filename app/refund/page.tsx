"use client";

import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050307]">
      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-4">
            Refund & Return Policy
          </h1>
          <p className="text-black/60 dark:text-white/60">
            Last updated: January 18, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div className="space-y-8 text-black/80 dark:text-white/80">
            {/* 7-Day Money Back Guarantee */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                7-Day Money Back Guarantee
              </h2>
              <p className="mb-4">
                We stand behind the quality of our PRO analysis. If you're not satisfied with your purchase, we offer a full refund within 7 days of your purchase date.
              </p>
            </section>

            {/* How to Request a Refund */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                How to Request a Refund
              </h2>
              <p className="mb-4">
                To request a refund, please contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:support@gitcheck.me"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    support@gitcheck.me
                  </a>
                </li>
                <li>
                  <strong>Subject Line:</strong> "Refund Request - [Your GitHub Username]"
                </li>
              </ul>
              <p className="mb-4">
                Please include the following information in your refund request:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your GitHub username</li>
                <li>Transaction ID or receipt from Stripe</li>
                <li>Brief reason for the refund (optional but appreciated)</li>
              </ul>
            </section>

            {/* Refund Processing Time */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                Refund Processing Time
              </h2>
              <p className="mb-4">
                Once we receive your refund request:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We'll review your request within 24 hours</li>
                <li>Approved refunds will be processed within 3-5 business days</li>
                <li>The refund will be credited back to your original payment method</li>
                <li>Depending on your bank or card issuer, it may take an additional 5-10 business days for the refund to appear in your account</li>
              </ul>
            </section>

            {/* What Happens After Refund */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                What Happens After a Refund
              </h2>
              <p className="mb-4">
                Once your refund is processed:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your PRO analysis access will be revoked</li>
                <li>You'll still be able to access your basic (free) profile analysis</li>
                <li>All data remains in your profile for future upgrades</li>
              </ul>
            </section>

            {/* Non-Refundable Items */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                Non-Refundable Scenarios
              </h2>
              <p className="mb-4">
                We cannot provide refunds in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Requests made after 7 days from the purchase date</li>
                <li>Purchases made more than 30 days ago</li>
                <li>Chargebacks or disputes filed without first contacting us</li>
              </ul>
            </section>

            {/* Re-analysis Policy */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                Re-analysis Refund Policy
              </h2>
              <p className="mb-4">
                For re-analysis purchases ($2), the same 7-day refund policy applies. However, please note:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Re-analysis refunds are processed separately from initial PRO purchases</li>
                <li>You can request a refund for your most recent re-analysis within 7 days</li>
                <li>Your previous PRO analysis data will remain accessible</li>
              </ul>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                Questions?
              </h2>
              <p className="mb-4">
                If you have any questions about our refund policy, please don't hesitate to contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@gitcheck.me"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    support@gitcheck.me
                  </a>
                </li>
                <li>
                  Website:{" "}
                  <a
                    href="https://gitcheck.me"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    gitcheck.me
                  </a>
                </li>
              </ul>
            </section>

            {/* Customer Satisfaction */}
            <section className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                Our Commitment to You
              </h3>
              <p>
                We're committed to providing high-quality developer analytics. If our PRO analysis doesn't meet your expectations, we want to make it right. Your satisfaction is our priority, and we're here to help with any concerns you may have.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
