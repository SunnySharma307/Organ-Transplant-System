import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export function ProfileCard({ profile }: { profile: any }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold font-sans">
                    {profile.role === "donor" ? "D" : "R"}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-slate-900">{profile.role.toUpperCase()} Profile ({profile.id})</h3>
                    <p className="text-slate-600">Blood Type: <span className="font-medium">{profile.blood_type}</span></p>
                </div>
            </div>
            <ul className="space-y-2 text-slate-700">
                <li><span className="font-medium">Age:</span> {profile.age} (anonymized range)</li>
                <li><span className="font-medium">Location:</span> {profile.location}</li>
                <li><span className="font-medium">Comorbidities:</span> {profile.comorbidities || "None reported"}</li>
                {profile.urgency_score && <li><span className="font-medium">Urgency:</span> {profile.urgency_score}/10</li>}
            </ul>
            <div className="mt-4 flex items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md border border-emerald-100 w-fit">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Differential privacy applied</span>
            </div>
        </div>
    );
}
