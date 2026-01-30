// app/guidelines/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Landmark,
  Lock,
} from "lucide-react";

// --- 1. DEFINING THE DATA (This was missing) ---
const guidelinesData = [
  {
    id: "sec-1",
    title: "1. Statutory Framework & Licensing",
    icon: <Scale className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          All operations within this portal are governed by the{" "}
          <strong>
            Transplantation of Human Organs and Tissues Act (THOTA), 1994
          </strong>{" "}
          and its subsequent amendments (2011, 2014).
        </p>
        <p>
          Access to the National Registry is granted strictly to hospitals
          holding a valid <strong>Form 12 Certificate of Registration</strong>.
          It is the responsibility of the designated{" "}
          <strong>Nodal Officer</strong> to ensure:
        </p>
        <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
          <li>
            The hospital's license is active and has not expired (Renewal
            required every 5 years).
          </li>
          <li>Login credentials are not shared with unauthorized personnel.</li>
          <li>
            All adverse events are reported to the State Authorization Committee
            within 24 hours.
          </li>
        </ul>
        <div className="bg-red-50 border-l-4 border-red-600 p-3 mt-4">
          <p className="text-xs text-red-800 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Zero Tolerance Policy:
          </p>
          <p className="text-xs text-red-700 mt-1">
            Any attempt to manipulate waitlist data or engage in commercial
            dealings of human organs will result in immediate license revocation
            and criminal prosecution under Section 19 of the Act.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "sec-2",
    title: "2. Brain Stem Death (BSD) Certification",
    icon: <FileText className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          For deceased donor organ retrieval, strict adherence to the{" "}
          <strong>Board of Medical Experts</strong> certification process is
          mandatory.
        </p>
        <h4 className="font-bold text-slate-900 text-xs uppercase mt-4">
          Mandatory Protocol (Form 10):
        </h4>
        <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
          <li>
            <strong>First Examination:</strong> Must be conducted by the
            authorized panel of 4 doctors (including one
            Neurologist/Neurosurgeon).
          </li>
          <li>
            <strong>Observation Period:</strong> A minimum interval of{" "}
            <strong>6 hours</strong> is mandatory between the first and second
            apnea test.
          </li>
          <li>
            <strong>Digital Evidence:</strong> Video recording of the Apnea Test
            is mandatory and must be uploaded to this portal under the "Donor
            File" section.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "sec-3",
    title: "3. Recipient Waitlist Criteria",
    icon: <CheckCircle2 className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Hospitals must update patient status in real-time. The Allocation
          Algorithm utilizes a scoring system (MELD/PELD for Liver, KDPI for
          Kidney) to determine priority.
        </p>
        <div className="border border-slate-200 rounded-sm overflow-hidden mt-2">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
              <tr>
                <th className="p-3 border-b">Status Code</th>
                <th className="p-3 border-b">Definition</th>
                <th className="p-3 border-b">Update Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-mono font-bold text-blue-800">
                  ACTIVE
                </td>
                <td className="p-3">
                  Ready for transplant. Antibody screening valid.
                </td>
                <td className="p-3">Every 14 Days</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-slate-500">
                  TEMP_HOLD
                </td>
                <td className="p-3">
                  Patient currently unfit (Infection/Fever).
                </td>
                <td className="p-3">As required</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-red-600">
                  SUPER_URGENT
                </td>
                <td className="p-3">
                  Imminent organ failure (e.g. Fulminant Hepatic Failure).
                </td>
                <td className="p-3">Every 24 Hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "sec-4",
    title: "4. Organ Allocation Sequence",
    icon: <BookOpen className="w-5 h-5" />,
    content: (
      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>
          Organs are allocated based on the following geographical hierarchy to
          minimize <strong>Cold Ischemia Time (CIT)</strong>:
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 p-3 rounded-sm border border-slate-200">
          <span>1. In-House</span>
          <ChevronRight size={14} />
          <span>2. District</span>
          <ChevronRight size={14} />
          <span>3. State</span>
          <ChevronRight size={14} />
          <span>4. Regional (ROTTO)</span>
          <ChevronRight size={14} />
          <span>5. National (NOTTO)</span>
        </div>
        <p className="text-xs text-slate-500 italic">
          *Exceptions apply for Super Urgent listings and Pediatric recipients.
        </p>
      </div>
    ),
  },
];

export default function GuidelinesPage() {
  const [activeSection, setActiveSection] = useState("sec-1");

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* --- OFFICIAL TOP BAR (same as login page) --- */}
      <header className="bg-white border-b border-slate-300 py-3 px-4 md:px-8 flex items-center gap-4 shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-900 text-white rounded">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-blue-900 uppercase tracking-wide leading-tight">
            National Organ & Tissue Transplant Organization
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Ministry of Health & Family Welfare
          </p>
        </div>
        <div className="ml-auto hidden md:block text-right">
          <p className="text-xs font-bold text-slate-700">
            Hospital Portal Access
          </p>
          <p className="text-xs text-slate-500">Secure Gateway v2.4.0</p>
        </div>
      </header>

      {/* --- NAV STRIP (same as login page) --- */}
      <div className="bg-blue-900 text-white text-sm py-2 px-8 flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/" className="hover:underline cursor-pointer">
            Home
          </Link>
          <Link
            href="/guidelines"
            className="hover:underline cursor-pointer font-semibold"
          >
            Guidelines
          </Link>
          <span className="hover:underline cursor-pointer opacity-80">
            Hospital Directory
          </span>
          <span className="hover:underline cursor-pointer opacity-80">
            Contact Support
          </span>
        </div>
        <div className="flex items-center gap-2 text-blue-200">
          <Lock size={12} />
          <span className="text-xs uppercase">256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex gap-8">
        {/* Left Sidebar: Navigation */}
        <aside className="hidden md:block w-1/4 shrink-0 sticky top-[7.5rem]">
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
              Table of Contents
            </div>
            <nav className="divide-y divide-slate-100">
              {guidelinesData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-4 text-sm font-medium flex items-center gap-3 transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-900 border-l-4 border-blue-900"
                      : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="text-slate-400">
                    {item.title.split(" ")[0]}
                  </div>
                  <span className="truncate">{item.title.substring(3)}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border-b border-slate-300 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Operational Guidelines & Protocols
            </h1>
          </div>

          {guidelinesData.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`bg-white border border-slate-300 rounded-sm shadow-sm scroll-mt-24 transition-all duration-300 ${
                activeSection === section.id
                  ? "ring-2 ring-blue-900 ring-offset-2"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
                <div className="text-blue-900 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  {section.title}
                </h2>
              </div>
              <div className="p-6">{section.content}</div>
            </section>
          ))}
        </div>
      </main>

      {/* --- FOOTER (same as login page) --- */}
      <footer className="bg-white border-t border-slate-300 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>
            © 2024 National Organ & Tissue Transplant Organization. All Rights
            Reserved.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="hover:text-blue-800 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-blue-800 cursor-pointer">
              Terms of Use
            </span>
            <span className="hover:text-blue-800 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
