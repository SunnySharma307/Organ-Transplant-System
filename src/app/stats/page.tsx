"use client";

import Link from "next/link";
import { ArrowLeft, TrendingDown, Users, Activity, Globe } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GlobalStats() {
    // Mock Data
    const currentWaitlist = 103248;
    const projectedReduction = Math.round(currentWaitlist * 0.28); // 28% reduction

    const stats = [
        {
            label: "Current Global Waitlist",
            value: currentWaitlist.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Lives Saved (Projected)",
            value: `+${projectedReduction.toLocaleString()}`,
            icon: TrendingDown,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "28% reduction in wait time"
        },
        {
            label: "Avg. Match Success",
            value: "85%",
            icon: Activity,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            desc: "vs. 62% baseline"
        },
        {
            label: "Cross-Border Viability",
            value: "34%",
            icon: Globe,
            color: "text-purple-600",
            bg: "bg-purple-50",
            desc: "Matches found internationally"
        },
    ];

    const chartData = [
        { name: 'Kidney', current: 89792, projected: 64650 },
        { name: 'Liver', current: 9424, projected: 7539 },
        { name: 'Heart', current: 3456, projected: 2419 },
        { name: 'Lung', current: 898, projected: 628 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-800 -ml-4 mb-4 gap-2">
                            <ArrowLeft className="size-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Global Impact Simulation</h1>
                    <p className="text-slate-500 mt-2">Projected outcomes of privacy-preserving federated matching at scale.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                            <div className={`p-3 rounded-lg w-fit mb-4 ${s.bg} ${s.color}`}>
                                <s.icon className="size-6" />
                            </div>
                            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-sm font-medium text-slate-600 mt-1">{s.label}</p>
                            {s.desc && <p className="text-xs text-slate-400 mt-2 italic">{s.desc}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Projected Waitlist Reduction</h2>
                            <p className="text-sm text-slate-500">Comparison of current waitlist vs. optimized AI matching (by organ type)</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="current" name="Current Waitlist" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="projected" name="With AI Matching" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Qualitative Impact */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-xl shadow-lg text-white flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-4">Why it matters?</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-200 mb-2">Eliminating Geographic Waste</h3>
                                <p className="text-indigo-100/80 leading-relaxed">
                                    Currently, thousands of organs are discarded because a local match isn't found in time.
                                    Global matching ensures every viable organ finds a recipient, regardless of borders.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-200 mb-2">Privacy Unlocks Data</h3>
                                <p className="text-indigo-100/80 leading-relaxed">
                                    Hospitals mimic isolated silos due to privacy laws. Differential Privacy allows them to
                                    contribute to the global pool without risking patient confidentiality.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
