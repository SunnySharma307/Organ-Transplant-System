"use client";

import Link from "next/link";
import {
  Landmark,
  ShieldCheck,
  Activity,
  Users,
  FileText,
  Building2,
  ArrowRight,
  Lock,
  CheckCircle2,
  Handshake,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* --- TOP BAR (Government style) --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-blue-900 text-white rounded flex-shrink-0">
              <Landmark size={28} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-blue-900 uppercase tracking-wide leading-tight">
                National Organ & Tissue Transplant Organization
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                Ministry of Health & Family Welfare • Government of India
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <Link
              href="/guidelines"
              className="text-sm font-medium text-slate-700 hover:text-blue-900 px-3 py-2 rounded hover:bg-slate-100 transition-colors"
            >
              Guidelines
            </Link>
            <Link
              href="/portal"
              className="text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
            >
              <Lock size={14} />
              Hospital Login
            </Link>
            <Link
              href="/portal"
              className="text-sm font-medium text-blue-900 border-2 border-blue-900 hover:bg-blue-50 px-4 py-2 rounded transition-colors"
            >
              Register Hospital
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="bg-gradient-to-b from-blue-950 to-blue-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
            National Registry Portal
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl mx-auto mb-6">
            Transparent, Equitable Organ Allocation for India
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            NOTTO&apos;s official portal for licensed transplant hospitals to
            manage waitlists, organ inventory, and allocation—in compliance with
            the Transplantation of Human Organs and Tissues Act, 1994.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded shadow-lg hover:bg-slate-100 transition-colors"
            >
              Hospital Login <ArrowRight size={18} />
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white font-bold px-8 py-4 rounded border-2 border-white/30 hover:bg-blue-700 transition-colors"
            >
              <Building2 size={18} /> Apply for Hospital Verification
            </Link>
          </div>
        </div>
      </section>

      {/* --- ABOUT THIS APPLICATION --- */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase tracking-wide mb-8 text-center">
            About This Application
          </h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-slate-700 leading-relaxed mb-4">
                The{" "}
                <strong>
                  National Organ & Tissue Transplant Organization (NOTTO)
                </strong>{" "}
                Portal is the Government of India&apos;s official digital
                platform for the management of organ and tissue transplantation
                across the country.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                This application enables{" "}
                <strong>licensed transplant hospitals</strong> to register
                patients on the national waitlist, log organ retrievals, respond
                to allocation offers, and submit mandatory statutory reports—all
                in a secure, auditable manner.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Operations are governed by the{" "}
                <strong>
                  Transplantation of Human Organs and Tissues Act (THOTA), 1994
                </strong>{" "}
                and its amendments. Access is restricted to institutions holding
                a valid <strong>Form 12 Certificate of Registration</strong>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <Users className="w-10 h-10 text-blue-900 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">
                  National Waitlist
                </h4>
                <p className="text-sm text-slate-600">
                  Unified patient registry with real-time status updates.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <Activity className="w-10 h-10 text-blue-900 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">
                  Organ Allocation
                </h4>
                <p className="text-sm text-slate-600">
                  Transparent, rule-based allocation (MELD, KDPI, etc.).
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <FileText className="w-10 h-10 text-blue-900 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">
                  Statutory Compliance
                </h4>
                <p className="text-sm text-slate-600">
                  Form 10, Form 12, and mandatory reporting.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <ShieldCheck className="w-10 h-10 text-blue-900 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">
                  Secure & Auditable
                </h4>
                <p className="text-sm text-slate-600">
                  256-bit SSL, role-based access, audit logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase tracking-wide mb-10 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h4 className="font-bold text-slate-800 mb-2">
                Register & Get Verified
              </h4>
              <p className="text-sm text-slate-600">
                Hospitals apply with license details. NOTTO verifies and grants
                portal access.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h4 className="font-bold text-slate-800 mb-2">List Patients</h4>
              <p className="text-sm text-slate-600">
                Add patients to the national waitlist with clinical and HLA
                data. Keep status updated.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h4 className="font-bold text-slate-800 mb-2">
                Log Organs & Respond
              </h4>
              <p className="text-sm text-slate-600">
                Record retrievals. Receive allocation offers. Accept or decline
                within the stipulated time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                4
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Report & Comply</h4>
              <p className="text-sm text-slate-600">
                Submit Form 10 (BSD), Form 12, and other mandatory reports as
                per NOTTO guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COLLABORATION --- */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 uppercase tracking-wide mb-8 text-center">
            Collaboration & Network
          </h3>
          <div className="max-w-3xl mx-auto text-center text-slate-700 leading-relaxed space-y-4">
            <p>
              NOTTO works with{" "}
              <strong>
                Regional Organ and Tissue Transplant Organizations (ROTTO)
              </strong>{" "}
              and
              <strong>
                {" "}
                State Organ and Tissue Transplant Organizations (SOTTO)
              </strong>{" "}
              to ensure organs are allocated fairly—first at the hospital, then
              district, state, regional, and national level—to minimize cold
              ischemia time and maximize outcomes.
            </p>
            <p>
              Only <strong>verified, licensed hospitals</strong> can access this
              portal. Verification requires a valid Form 12 Certificate and
              designation of a <strong>Nodal Officer</strong>. Unauthorized
              access is prohibited under the IT Act, 2000.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded border border-slate-200">
              <Handshake className="w-6 h-6 text-blue-900" />
              <span className="font-semibold text-slate-800">
                NOTTO • ROTTO • SOTTO
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded border border-slate-200">
              <CheckCircle2 className="w-6 h-6 text-green-700" />
              <span className="font-semibold text-slate-800">
                Licensed Transplant Centers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOSPITAL CTA --- */}
      <section className="py-16 md:py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
            Hospitals: Login or Get Verified
          </h3>
          <p className="text-blue-100 mb-8">
            If your institution is already registered, log in to manage
            waitlists and allocations. New hospitals can apply for verification;
            access is granted after NOTTO approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded shadow-lg hover:bg-slate-100 transition-colors"
            >
              <Lock size={18} /> Hospital Login
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white font-bold px-8 py-4 rounded border-2 border-white/30 hover:bg-blue-700 transition-colors"
            >
              <Building2 size={18} /> Register & Get Verified
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-6">
            Need help? Contact support@notto.gov.in or 1800-11-XXXX
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-800 text-slate-300 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
                <Landmark size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm uppercase">NOTTO</p>
                <p className="text-xs text-slate-400">
                  National Organ & Tissue Transplant Organization
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/guidelines"
                className="hover:text-white transition-colors"
              >
                Guidelines
              </Link>
              <Link
                href="/portal"
                className="hover:text-white transition-colors"
              >
                Hospital Portal
              </Link>
              <span className="cursor-pointer hover:text-white transition-colors">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-white transition-colors">
                Terms of Use
              </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-slate-500 text-center">
            © 2024 National Organ & Tissue Transplant Organization. All Rights
            Reserved. Ministry of Health & Family Welfare, Government of India.
          </div>
        </div>
      </footer>
    </div>
  );
}
