"use client";

import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CompatibilityChartProps {
    breakdown: {
        blood: number;
        hla: number;
        proximity: number;
        urgency: number;
    };
}

export function CompatibilityChart({ breakdown }: CompatibilityChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[300px] bg-slate-50 rounded animate-pulse" />;

    const data = [
        { subject: 'Blood Match', A: breakdown.blood, fullMark: 1 },
        { subject: 'HLA Similarity', A: breakdown.hla, fullMark: 1 },
        { subject: 'Proximity', A: breakdown.proximity, fullMark: 1 },
        { subject: 'Urgency', A: breakdown.urgency, fullMark: 1 },
    ];

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar
                        name="Compatibility Score"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        formatter={(value: any) => [value.toFixed(2), 'Score']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
