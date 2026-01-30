"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Building2,
  Lock,
  ShieldAlert,
  ChevronRight,
  AlertCircle,
  Landmark,
} from "lucide-react";

type AuthMode = "login" | "register";

interface HospitalData {
  hospitalName: string;
  licenseNumber: string;
  email: string;
  password: string;
  state: string;
  district: string;
  nodalOfficerName: string;
}

export default function HospitalPortal() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<HospitalData>({
    hospitalName: "",
    licenseNumber: "",
    email: "",
    password: "",
    state: "",
    district: "",
    nodalOfficerName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === "auth/invalid-credential") {
        setError("Invalid Hospital ID or Password.");
      } else {
        setError("System Error: " + (e.message ?? "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-300 py-3 px-4 md:px-8 flex items-center gap-4 shadow-sm">
        <Link href="/" className="flex items-center gap-4">
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
        </Link>
        <div className="ml-auto hidden md:block text-right">
          <p className="text-xs font-bold text-slate-700">
            Hospital Portal Access
          </p>
          <p className="text-xs text-slate-500">Secure Gateway v2.4.0</p>
        </div>
      </header>

      <div className="bg-blue-900 text-white text-sm py-2 px-8 flex justify-between items-center">
        <div className="flex gap-6">
          <Link href="/" className="hover:underline cursor-pointer">
            Home
          </Link>
          <Link href="/guidelines" className="hover:underline cursor-pointer">
            Guidelines
          </Link>
          <span className="text-white/80">Hospital Portal</span>
          <span className="opacity-80 cursor-not-allowed">Contact Support</span>
        </div>
        <div className="flex items-center gap-2 text-blue-200">
          <Lock size={12} />
          <span className="text-xs uppercase">256-Bit SSL Encrypted</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        <div className="hidden md:block w-1/3 space-y-6">
          <div className="bg-white border border-slate-300 p-5 rounded-sm shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-blue-900 border-b border-slate-200 pb-2 mb-3">
              <ShieldAlert size={18} />
              Important Notice
            </h3>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <p>
                Access to this portal is restricted to{" "}
                <strong>Licensed Organ Retrieval & Transplant Hospitals</strong>{" "}
                only.
              </p>
              <p>
                Unauthorized access attempts are monitored and will be reported
                under the{" "}
                <span className="font-semibold text-red-700">IT Act, 2000</span>
                .
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-xs text-yellow-800 mt-4">
                <strong>System Update:</strong> The allocation algorithm will be
                undergoing scheduled maintenance on Sunday (02:00 AM - 04:00
                AM).
              </div>
            </div>
          </div>

          <div className="bg-slate-200 border border-slate-300 p-5 rounded-sm">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">
              Helpdesk Support
            </h4>
            <p className="text-xs text-slate-600 mb-1">For technical issues:</p>
            <p className="font-mono text-sm font-bold text-slate-800 underline">
              1800-11-XXXX
            </p>
            <p className="font-mono text-sm text-blue-800 underline mt-1">
              support@notto.gov.in
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-lg bg-white border border-slate-300 shadow-md rounded-sm">
            <div className="bg-slate-50 border-b border-slate-300 p-4 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Building2 size={20} className="text-blue-700" />
                {mode === "login"
                  ? "Institutional Login"
                  : "New Hospital Registration"}
              </h2>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Hospital License No.{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          required
                          className="w-full border border-slate-300 p-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded-sm"
                          placeholder="Ex: H-2023-WB-001"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          State / Region <span className="text-red-600">*</span>
                        </label>
                        <select
                          name="state"
                          required
                          className="w-full border border-slate-300 p-2 text-sm bg-white focus:border-blue-600 outline-none rounded-sm"
                          value={formData.state}
                          onChange={handleInputChange}
                        >
                          <option value="">Select State</option>
                          <option value="MH">Maharashtra</option>
                          <option value="DL">Delhi</option>
                          <option value="KA">Karnataka</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Registered Hospital Name{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="hospitalName"
                        required
                        className="w-full border border-slate-300 p-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded-sm"
                        placeholder="Official name as per license"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nodal Officer Name{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nodalOfficerName"
                        required
                        className="w-full border border-slate-300 p-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded-sm"
                        placeholder="Dr. Name Surname"
                        value={formData.nodalOfficerName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Official Email ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-slate-300 p-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded-sm"
                    placeholder="admin@hospital.org"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {mode === "register" && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Must be an official institutional domain.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full border border-slate-300 p-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none rounded-sm"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 flex items-center gap-3 rounded-sm my-2">
                  <div className="w-5 h-5 border-2 border-slate-300 bg-white rounded-sm" />
                  <span className="text-sm text-slate-600">
                    I am not a robot
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors text-sm uppercase tracking-wide disabled:opacity-70"
                  >
                    {isLoading
                      ? "Processing..."
                      : mode === "login"
                        ? "Secure Login"
                        : "Submit for Verification"}
                    {!isLoading && <ChevronRight size={16} />}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                {mode === "login" ? (
                  <p className="text-xs text-slate-600">
                    New Institution?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-blue-800 font-bold hover:underline"
                    >
                      Apply for Portal Access
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">
                    Already Licensed?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-blue-800 font-bold hover:underline"
                    >
                      Back to Login
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-300 text-center">
              <p className="text-[10px] text-slate-400">
                Authorized use only. IP Address logged.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-300 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>
            © 2024 National Organ & Tissue Transplant Organization. All Rights
            Reserved.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/" className="hover:text-blue-800 cursor-pointer">
              Home
            </Link>
            <span className="hover:text-blue-800 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-blue-800 cursor-pointer">
              Terms of Use
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
