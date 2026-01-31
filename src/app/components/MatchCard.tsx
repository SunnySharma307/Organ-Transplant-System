import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export function MatchCard({ match, showExact, recipientLocation }: { match: any, showExact?: boolean, recipientLocation?: string }) {
    const isCrossBorder = recipientLocation && match.location && match.location !== recipientLocation;

    const explanation = `
    ${isCrossBorder ? "🌍 Cross-Border Match • " : ""}High blood match • Moderate HLA similarity • 
    Proximity: ~${Math.round(match.distance || 5000)}km • 
    Urgency boost applied
  `;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Donor #{match.donor_id}</h3>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">Global Entry</span>
            </div>

            <div className="mb-4">
                {showExact ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-2">
                            <p className="text-sm font-bold text-red-600 flex items-center gap-1.5">
                                <span>⚠️ Exact Score: {match.exact_score}</span>
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                                (Unsafe: Could enable re-identification)
                            </p>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <p className="text-sm font-medium text-slate-600">Noisy Score: <span className="text-purple-600 font-bold">{match.noisy_score}</span></p>
                            <span className="text-xs text-emerald-600 font-medium flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                                <ShieldCheckIcon className="size-3 mr-1" /> Protected
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-3 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                            <strong>Privacy prevents breach:</strong> Without noise, exact age/HLA could identify individuals from public data. DP ensures aggregates stay useful while protecting patient identity.
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-purple-600">
                                {match.noisy_score}
                            </span>
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                Noisy Score (Private)
                            </span>
                        </div>

                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            <ShieldCheckIcon className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">DP active</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Success Probability:</span>
                    <span className="font-semibold text-slate-700">{(match.prob_success * 100).toFixed(1)}%</span>
                </div>
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">{explanation}</p>
            </div>
        </div>
    );
}
