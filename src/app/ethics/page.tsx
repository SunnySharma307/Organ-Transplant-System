"use client";

import { ShieldCheck, Lock, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Ethics() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-800 -ml-4 mb-4 gap-2">
                            <ArrowLeft className="size-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Privacy & Ethics Statement</h1>
                    <p className="text-slate-500 mt-2">Transparent AI and Private Matching Protocols</p>
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <ShieldCheck className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">Differential Privacy Method</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    We use Gaussian noise addition (via <code className="bg-slate-100 px-1 py-0.5 rounded text-sm text-slate-800">diffprivlib</code>)
                                    on sensitive fields like age and urgency scores. This adds calibrated noise (ε=0.5–1.0) to prevent
                                    re-identification while keeping aggregate matching accurate.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Lock className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">Consent Flow</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Users explicitly consent during registration. Data is pseudonymized; you can withdraw
                                    anytime via account settings. No raw data is shared across regional borders without explicit opt-in.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                <Scale className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-2">Bias Mitigation</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    ML models are trained on diverse mock/global data with no weighting by demographics.
                                    We perform regular audits for fairness and maintain transparency in scoring factors
                                    (viewable in individual match cards).
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
