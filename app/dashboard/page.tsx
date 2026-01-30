"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  Bell,
  Settings,
  LogOut,
  Landmark,
  Search,
  AlertCircle,
  Clock,
  X,
  Save,
  Stethoscope,
  Heart,
} from "lucide-react";

type DashboardSection =
  | "overview"
  | "patient-waitlist"
  | "organ-inventory"
  | "allocation-status"
  | "mandatory-reports"
  | "hospital-profile"
  | "alerts";

// Organ-specific tests for compatibility matching (donor & recipient)
const ORGAN_TESTS: Record<string, { label: string; key: string }[]> = {
  heart: [
    { label: "PRA (Panel Reactive Antibody)", key: "pra" },
    { label: "CT", key: "ct" },
    { label: "MRI", key: "mri" },
    { label: "ECHO", key: "echo" },
  ],
  kidney: [
    { label: "Blood Test", key: "bloodTest" },
    { label: "HLA Test", key: "hlaTest" },
    { label: "Hemoglobin Test", key: "hemoglobinTest" },
    { label: "Blood Chemistry Test", key: "bloodChemistryTest" },
  ],
  liver: [
    { label: "HIV Test", key: "hivTest" },
    { label: "CMV Test", key: "cmvTest" },
    { label: "LFTs Test", key: "lftsTest" },
  ],
  lungs: [
    { label: "PFTs Test", key: "pftsTest" },
    { label: "CT", key: "ct" },
    { label: "X-ray", key: "xray" },
    { label: "ECHO", key: "echo" },
  ],
};

// Map recipient "Organ Required" dropdown value to test group key
function getRecipientOrganKey(organRequired: string): string | null {
  const m: Record<string, string> = {
    "Kidney (Left)": "kidney",
    "Kidney (Right)": "kidney",
    "Liver (Whole)": "liver",
    Heart: "heart",
    Lungs: "lungs",
  };
  return m[organRequired] ?? null;
}

// Donor checkbox labels that map to test groups (show tests once per group)
const DONOR_ORGAN_OPTIONS: {
  label: string;
  key: string;
  testGroup: string | null;
}[] = [
  { label: "Kidney (L)", key: "kidneyL", testGroup: "kidney" },
  { label: "Kidney (R)", key: "kidneyR", testGroup: "kidney" },
  { label: "Liver (Partial)", key: "liverPartial", testGroup: "liver" },
  { label: "Heart", key: "heart", testGroup: "heart" },
  { label: "Lungs", key: "lungs", testGroup: "lungs" },
  { label: "Pancreas", key: "pancreas", testGroup: null },
  { label: "Cornea (L)", key: "corneaL", testGroup: null },
  { label: "Cornea (R)", key: "corneaR", testGroup: null },
  { label: "Skin", key: "skin", testGroup: null },
  { label: "Bone", key: "bone", testGroup: null },
];

export default function Dashboard() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDonorRegisterOpen, setIsDonorRegisterOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");

  // Recipient registration: step 1 = identity/clinical, step 2 = organ-specific tests
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [recipientOrganRequired, setRecipientOrganRequired] = useState("");

  // Donor registration: step 1 = identity/organs, step 2 = organ-specific tests
  const [donorStep, setDonorStep] = useState<1 | 2>(1);
  const [donorOrgansSelected, setDonorOrgansSelected] = useState<
    Record<string, boolean>
  >({});

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col relative">
      {/* --- 1. MODAL: PATIENT REGISTRATION FORM --- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center rounded-t-sm">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Stethoscope size={18} />
                  New Patient Registration (Form-1A)
                </h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-wider">
                  National Waitlist Registry • Mandatory Field (*)
                </p>
              </div>
              <button
                onClick={() => {
                  setIsRegisterOpen(false);
                  setRegisterStep(1);
                  setRecipientOrganRequired("");
                }}
                className="hover:bg-blue-800 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <div className="p-6 overflow-y-auto">
              {registerStep === 1 ? (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const organKey = getRecipientOrganKey(
                      recipientOrganRequired,
                    );
                    if (organKey) {
                      setRegisterStep(2);
                    } else {
                      setIsRegisterOpen(false);
                      setRegisterStep(1);
                      setRecipientOrganRequired("");
                    }
                  }}
                >
                  {/* Section 1: Identity */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      1. Patient Identity Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Legal Name{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm focus:border-blue-800 focus:ring-1 focus:ring-blue-800 outline-none"
                          placeholder="As per Aadhaar/Govt ID"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Unique Health ID (ABHA){" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm focus:border-blue-800 outline-none"
                          placeholder="XX-XXXX-XXXX-XXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Date of Birth <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gender <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none">
                          <option>Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Blood Group <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none font-bold text-slate-700">
                          <option>Select</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>O+</option>
                          <option>O-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Clinical Requirement */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      2. Clinical Requirement
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Organ Required <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={recipientOrganRequired}
                          onChange={(e) =>
                            setRecipientOrganRequired(e.target.value)
                          }
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none"
                        >
                          <option value="">Select Organ</option>
                          <option>Kidney (Left)</option>
                          <option>Kidney (Right)</option>
                          <option>Liver (Whole)</option>
                          <option>Heart</option>
                          <option>Lungs</option>
                          <option>Cornea</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Urgency Status <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none">
                          <option>Elective (Routine)</option>
                          <option className="text-amber-600 font-bold">
                            Urgent (Hospitalized)
                          </option>
                          <option className="text-red-600 font-bold">
                            Super Urgent (ICU/Life Support)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clinical Indication / Diagnosis
                      </label>
                      <textarea
                        className="w-full border border-slate-300 p-2 text-sm rounded-sm h-20 outline-none focus:border-blue-800"
                        placeholder="E.g. End-stage renal disease (ESRD) on maintenance dialysis..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Checkbox Declaration */}
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 flex items-start gap-3">
                    <input type="checkbox" id="declare" className="mt-1" />
                    <label htmlFor="declare" className="text-xs text-slate-600">
                      I certify that the above clinical details are verified by
                      a competent medical authority. I understand that false
                      data entry is a punishable offense under the{" "}
                      <strong className="text-slate-800">
                        Transplantation of Human Organs Act, 1994
                      </strong>
                      .
                    </label>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-sm -mx-6 -mb-6 px-6 pb-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setRegisterStep(1);
                        setRecipientOrganRequired("");
                      }}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Save size={16} />
                      {getRecipientOrganKey(recipientOrganRequired)
                        ? "Next: Enter Test Results"
                        : "Submit to Registry"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsRegisterOpen(false);
                    setRegisterStep(1);
                    setRecipientOrganRequired("");
                  }}
                >
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      Organ-Specific Test Results (Recipient) —{" "}
                      {recipientOrganRequired}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Enter test results for compatibility matching with donors.
                    </p>
                    {(() => {
                      const organKey = getRecipientOrganKey(
                        recipientOrganRequired,
                      );
                      const tests = organKey
                        ? (ORGAN_TESTS[organKey] ?? [])
                        : [];
                      return (
                        <div className="grid grid-cols-1 gap-4">
                          {tests.map((t) => (
                            <div
                              key={t.key}
                              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                            >
                              <label className="block text-xs font-bold text-slate-700 sm:w-48 shrink-0">
                                {t.label}{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <div className="flex-1 flex gap-2 flex-wrap">
                                <input
                                  type="text"
                                  name={`recipient_${organKey}_${t.key}`}
                                  className="flex-1 min-w-[120px] border border-slate-300 p-2 text-sm rounded-sm outline-none focus:border-blue-800"
                                  placeholder="Result / Value"
                                />
                                <input
                                  type="date"
                                  name={`recipient_${organKey}_${t.key}_date`}
                                  className="border border-slate-300 p-2 text-sm rounded-sm outline-none w-[140px]"
                                  placeholder="Date"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-sm -mx-6 -mb-6 px-6 pb-0">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-sm transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Save size={16} />
                      Submit to Registry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DONOR REGISTRATION MODAL --- */}
      {isDonorRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]">
            <div className="bg-green-800 text-white px-6 py-4 flex justify-between items-center rounded-t-sm">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Heart size={18} />
                  Donor Registration (Voluntary / Deceased)
                </h3>
                <p className="text-[10px] text-green-200 uppercase tracking-wider">
                  National Organ Donor Registry • Mandatory Field (*)
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDonorRegisterOpen(false);
                  setDonorStep(1);
                  setDonorOrgansSelected({});
                }}
                className="hover:bg-green-700 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {donorStep === 1 ? (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const selectedGroups = [
                      ...new Set(
                        DONOR_ORGAN_OPTIONS.filter(
                          (o) => donorOrgansSelected[o.key] && o.testGroup,
                        ).map((o) => o.testGroup),
                      ),
                    ] as string[];
                    if (selectedGroups.length > 0) {
                      setDonorStep(2);
                    } else {
                      setIsDonorRegisterOpen(false);
                      setDonorStep(1);
                      setDonorOrgansSelected({});
                    }
                  }}
                >
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      1. Donor Type & Identity
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Donor Type <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800">
                          <option value="">Select</option>
                          <option value="living">
                            Living Donor (Related / Altruistic)
                          </option>
                          <option value="deceased">
                            Deceased Donor (Cadaveric)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Legal Name{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm focus:border-green-800 focus:ring-1 focus:ring-green-800 outline-none"
                          placeholder="As per Aadhaar/Govt ID"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Unique Health ID (ABHA){" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none"
                          placeholder="XX-XXXX-XXXX-XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Date of Birth <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gender <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none">
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Blood Group <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full border border-slate-300 p-2 text-sm rounded-sm bg-white outline-none font-bold text-slate-700">
                          <option value="">Select</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>O+</option>
                          <option>O-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      2. Organs / Tissues Willing to Donate
                    </h4>
                    <p className="text-xs text-slate-600">
                      Select all that apply (for living donor: as per medical
                      eligibility).
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DONOR_ORGAN_OPTIONS.map((opt) => (
                        <label
                          key={opt.key}
                          className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={donorOrgansSelected[opt.key] ?? false}
                            onChange={(e) =>
                              setDonorOrgansSelected((prev) => ({
                                ...prev,
                                [opt.key]: e.target.checked,
                              }))
                            }
                            className="rounded border-slate-300 text-green-800 focus:ring-green-800"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                      3. Contact & Next of Kin
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Contact Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="tel"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none focus:border-green-800"
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none focus:border-green-800"
                          placeholder="donor@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Next of Kin Name & Relation{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 p-2 text-sm rounded-sm outline-none focus:border-green-800"
                        placeholder="e.g. Spouse / Parent / Sibling"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="donor-declare"
                      className="mt-1"
                    />
                    <label
                      htmlFor="donor-declare"
                      className="text-xs text-slate-600"
                    >
                      I / We (legal guardian) understand that organ/tissue
                      donation is voluntary and governed by the{" "}
                      <strong className="text-slate-800">
                        Transplantation of Human Organs and Tissues Act, 1994
                      </strong>
                      . I certify that the information provided is accurate. For
                      deceased donation, consent from the family is mandatory.
                    </label>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-sm -mx-6 -mb-6 px-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDonorRegisterOpen(false);
                        setDonorStep(1);
                        setDonorOrgansSelected({});
                      }}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-bold text-white bg-green-800 hover:bg-green-700 rounded-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Save size={16} />
                      {[
                        ...new Set(
                          DONOR_ORGAN_OPTIONS.filter(
                            (o) => donorOrgansSelected[o.key] && o.testGroup,
                          ).map((o) => o.testGroup),
                        ),
                      ].length > 0
                        ? "Next: Enter Test Results"
                        : "Submit to Donor Registry"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsDonorRegisterOpen(false);
                    setDonorStep(1);
                    setDonorOrgansSelected({});
                  }}
                >
                  <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-200 pb-1">
                    Organ-Specific Test Results (Donor)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Enter test results for each organ you are donating. These
                    will be used for compatibility matching with recipients.
                  </p>
                  {(() => {
                    const selectedGroups = [
                      ...new Set(
                        DONOR_ORGAN_OPTIONS.filter(
                          (o) => donorOrgansSelected[o.key] && o.testGroup,
                        ).map((o) => o.testGroup),
                      ),
                    ] as string[];
                    const groupLabels: Record<string, string> = {
                      heart: "Heart",
                      kidney: "Kidney",
                      liver: "Liver",
                      lungs: "Lungs",
                    };
                    return (
                      <div className="space-y-8">
                        {selectedGroups.map((groupKey) => {
                          const tests = ORGAN_TESTS[groupKey] ?? [];
                          return (
                            <div
                              key={groupKey}
                              className="border border-slate-200 rounded-sm p-4 bg-slate-50/50"
                            >
                              <h5 className="text-sm font-bold text-slate-700 mb-4 capitalize">
                                {groupLabels[groupKey] ?? groupKey}
                              </h5>
                              <div className="grid grid-cols-1 gap-4">
                                {tests.map((t) => (
                                  <div
                                    key={t.key}
                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                                  >
                                    <label className="block text-xs font-bold text-slate-700 sm:w-48 shrink-0">
                                      {t.label}{" "}
                                      <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex-1 flex gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        name={`donor_${groupKey}_${t.key}`}
                                        className="flex-1 min-w-[120px] border border-slate-300 p-2 text-sm rounded-sm outline-none focus:border-green-800"
                                        placeholder="Result / Value"
                                      />
                                      <input
                                        type="date"
                                        name={`donor_${groupKey}_${t.key}_date`}
                                        className="border border-slate-300 p-2 text-sm rounded-sm outline-none w-[140px]"
                                        placeholder="Date"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-sm -mx-6 -mb-6 px-6">
                    <button
                      type="button"
                      onClick={() => setDonorStep(1)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-sm transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-bold text-white bg-green-800 hover:bg-green-700 rounded-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Save size={16} />
                      Submit to Donor Registry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- 2. MAIN DASHBOARD CONTENT (Background) --- */}

      {/* HEADER */}
      <header className="bg-white border-b border-slate-300 h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-900 text-white rounded flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-blue-900 uppercase tracking-wide leading-tight">
                National Organ & Tissue Transplant Organization
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Ministry of Health & Family Welfare • Govt. of India
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-600">
              System Online
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">
              Apollo Hospital, Delhi (H-204)
            </p>
            <p className="text-[10px] text-slate-500">
              Nodal Officer: Dr. Rajesh Verma
            </p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col z-30">
          <div className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Main Menu
            </p>
            <nav className="space-y-1">
              <NavItem
                icon={<LayoutDashboard size={18} />}
                label="Overview"
                active={activeSection === "overview"}
                onClick={() => setActiveSection("overview")}
              />
              <NavItem
                icon={<Users size={18} />}
                label="Patient Waitlist"
                active={activeSection === "patient-waitlist"}
                onClick={() => setActiveSection("patient-waitlist")}
              />
              <NavItem
                icon={<Activity size={18} />}
                label="Organ Inventory"
                active={activeSection === "organ-inventory"}
                onClick={() => setActiveSection("organ-inventory")}
              />
              <NavItem
                icon={<Clock size={18} />}
                label="Allocation Status"
                active={activeSection === "allocation-status"}
                onClick={() => setActiveSection("allocation-status")}
              />
              <NavItem
                icon={<FileText size={18} />}
                label="Mandatory Reports"
                active={activeSection === "mandatory-reports"}
                onClick={() => setActiveSection("mandatory-reports")}
              />
            </nav>
          </div>

          <div className="p-4 mt-auto border-t border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              System
            </p>
            <nav className="space-y-1">
              <NavItem
                icon={<Settings size={18} />}
                label="Hospital Profile"
                active={activeSection === "hospital-profile"}
                onClick={() => setActiveSection("hospital-profile")}
              />
              <NavItem
                icon={<Bell size={18} />}
                label="Alerts & Notices"
                active={activeSection === "alerts"}
                onClick={() => setActiveSection("alerts")}
              />
            </nav>
          </div>
        </aside>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-y-auto p-6 z-0">
          {activeSection === "overview" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Dashboard Overview
                  </h2>
                  <p className="text-sm text-slate-500">
                    Last Synced: Today, 10:42 AM IST
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
                    <FileText size={16} /> Download Report
                  </button>

                  {/* Recipient (needs organ) */}
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Users size={16} /> + Register New Patient
                  </button>

                  {/* Donor (willing to donate) */}
                  <button
                    onClick={() => setIsDonorRegisterOpen(true)}
                    className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Heart size={16} /> + Donor Registration
                  </button>
                </div>
              </div>

              {/* Alert Banner */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 flex items-start gap-3 rounded-r-sm">
                <AlertCircle className="text-amber-600 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">
                    Urgent Action Required
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    2 Patient profiles (ID: #KW-992, #LK-110) require updated
                    blood work (HLA Typing) within 24 hours to maintain
                    &quot;Active&quot; waitlist status.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                  label="Active Waitlist"
                  value="142"
                  subtext="+3 this week"
                  icon={<Users className="text-blue-600" />}
                />
                <StatCard
                  label="Organs Available"
                  value="02"
                  subtext="In-house retrieval"
                  icon={<Activity className="text-green-600" />}
                />
                <StatCard
                  label="Pending Allocations"
                  value="05"
                  subtext="Awaiting Acceptance"
                  icon={<Clock className="text-amber-600" />}
                />
                <StatCard
                  label="Transplants YTD"
                  value="28"
                  subtext="CY 2024"
                  icon={<LayoutDashboard className="text-purple-600" />}
                />
              </div>

              {/* Table Section */}
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">
                    Recent Allocation Requests
                  </h3>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search Patient ID..."
                      className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Request ID
                        </th>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Organ Type
                        </th>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Patient Details
                        </th>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Urgency Score
                        </th>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Status
                        </th>
                        <th className="px-6 py-3 border-b border-slate-200">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <TableRow
                        id="REQ-2024-001"
                        organ="Kidney (L)"
                        patient="Amit Kumar (M/45)"
                        score="KDPI: 85%"
                        status="Matching"
                        statusColor="bg-blue-100 text-blue-800"
                      />
                      <TableRow
                        id="REQ-2024-002"
                        organ="Liver"
                        patient="Sarah Khan (F/32)"
                        score="MELD: 32 (High)"
                        status="Offer Received"
                        statusColor="bg-green-100 text-green-800"
                      />
                      <TableRow
                        id="REQ-2024-003"
                        organ="Heart"
                        patient="Rajesh Singh (M/50)"
                        score="Status 1A"
                        status="Pending"
                        statusColor="bg-amber-100 text-amber-800"
                      />
                      <TableRow
                        id="REQ-2024-004"
                        organ="Cornea (R)"
                        patient="Baby Anjali (F/05)"
                        score="Pediatric Priority"
                        status="Scheduled"
                        statusColor="bg-purple-100 text-purple-800"
                      />
                    </tbody>
                  </table>
                </div>
                {/* Table Footer */}
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
                  <span>Showing 1-4 of 12 records</span>
                  <div className="flex gap-2">
                    <button className="hover:text-blue-700 font-bold">
                      Previous
                    </button>
                    <button className="hover:text-blue-700 font-bold">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "patient-waitlist" && (
            <PatientWaitlistView
              onRegisterClick={() => setIsRegisterOpen(true)}
            />
          )}
          {activeSection === "organ-inventory" && <OrganInventoryView />}
          {activeSection === "allocation-status" && <AllocationStatusView />}
          {activeSection === "mandatory-reports" && <MandatoryReportsView />}
          {activeSection === "hospital-profile" && (
            <PlaceholderView
              title="Hospital Profile"
              description="Manage institution details and nodal officer information."
            />
          )}
          {activeSection === "alerts" && (
            <PlaceholderView
              title="Alerts & Notices"
              description="System notifications and NOTTO circulars."
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-r-sm border-l-4 text-left ${active ? "bg-blue-900 border-blue-500 text-white" : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PatientWaitlistView({
  onRegisterClick,
}: {
  onRegisterClick: () => void;
}) {
  const waitlistRows = [
    {
      id: "KW-992",
      name: "Amit Kumar",
      organ: "Kidney (L)",
      bloodGroup: "B+",
      urgency: "Elective",
      status: "Active",
      listedDate: "15-Jan-2024",
    },
    {
      id: "LK-110",
      name: "Priya Sharma",
      organ: "Liver",
      bloodGroup: "O+",
      urgency: "Urgent",
      status: "Active",
      listedDate: "18-Jan-2024",
    },
    {
      id: "HT-204",
      name: "Rajesh Singh",
      organ: "Heart",
      bloodGroup: "A+",
      urgency: "Super Urgent",
      status: "Status 1A",
      listedDate: "20-Jan-2024",
    },
    {
      id: "CR-088",
      name: "Baby Anjali",
      organ: "Cornea (R)",
      bloodGroup: "AB+",
      urgency: "Pediatric",
      status: "Active",
      listedDate: "22-Jan-2024",
    },
    {
      id: "KW-445",
      name: "Suresh Patel",
      organ: "Kidney (R)",
      bloodGroup: "A-",
      urgency: "Elective",
      status: "Temp Hold",
      listedDate: "10-Jan-2024",
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Patient Waitlist
          </h2>
          <p className="text-sm text-slate-500">
            Manage patients registered on the national waitlist from this
            hospital.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <FileText size={16} /> Export List
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Users size={16} /> + Register New Patient
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 flex items-start gap-3 rounded-r-sm">
        <AlertCircle className="text-amber-600 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800">HLA Typing Due</h4>
          <p className="text-sm text-amber-700 mt-1">
            2 patients (#KW-992, #LK-110) require updated blood work within 24
            hours to retain Active status.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Waitlist Registry</h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by Patient ID or Name..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 w-72"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">
                  Patient ID
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Full Name
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Organ Required
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Blood Group
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Urgency</th>
                <th className="px-6 py-3 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Listed Date
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitlistRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 text-slate-800">{row.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {row.organ}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {row.bloodGroup}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        row.urgency === "Super Urgent"
                          ? "bg-red-100 text-red-800"
                          : row.urgency === "Urgent"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : row.status === "Temp Hold"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.listedDate}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-700 hover:underline font-bold text-xs">
                      View / Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
          <span>
            Showing 1–{waitlistRows.length} of {waitlistRows.length} records
          </span>
          <div className="flex gap-2">
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function OrganInventoryView() {
  const inventoryRows = [
    {
      id: "ORG-2024-KL-001",
      organType: "Kidney (L)",
      bloodGroup: "B+",
      donorType: "Deceased",
      source: "In-house",
      status: "Available",
      retrievedAt: "Today, 08:15 AM",
    },
    {
      id: "ORG-2024-LV-002",
      organType: "Liver",
      bloodGroup: "O+",
      donorType: "Deceased",
      source: "ROTTO-North",
      status: "Available",
      retrievedAt: "Today, 06:42 AM",
    },
    {
      id: "ORG-2024-KR-003",
      organType: "Kidney (R)",
      bloodGroup: "A-",
      donorType: "Deceased",
      source: "In-house",
      status: "Matching",
      retrievedAt: "Yesterday, 11:30 PM",
    },
    {
      id: "ORG-2024-CR-004",
      organType: "Cornea (Pair)",
      bloodGroup: "N/A",
      donorType: "Deceased",
      source: "In-house",
      status: "Available",
      retrievedAt: "Yesterday, 04:20 PM",
    },
    {
      id: "ORG-2024-HT-005",
      organType: "Heart",
      bloodGroup: "A+",
      donorType: "Deceased",
      source: "NOTTO",
      status: "Allocated",
      retrievedAt: "28-Jan-2024, 02:00 AM",
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Organ Inventory</h2>
          <p className="text-sm text-slate-500 mt-1">
            View and manage available organs from in-house and network
            retrievals.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <FileText size={16} /> Export Inventory
          </button>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <Activity size={16} /> + Log New Retrieval
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            In-house
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">02</p>
          <p className="text-xs text-slate-500">Current retrieval</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Network (ROTTO)
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">01</p>
          <p className="text-xs text-slate-500">Offered to pool</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Available
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">03</p>
          <p className="text-xs text-slate-500">Ready for allocation</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Last synced
          </p>
          <p className="text-lg font-bold text-slate-800 mt-1">10:42 AM</p>
          <p className="text-xs text-slate-500">IST</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Current Inventory</h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by Organ ID or Type..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 w-72"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">
                  Organ ID
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Organ Type
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Blood Group
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Donor Type
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Source</th>
                <th className="px-6 py-3 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Retrieved At
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.organType}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {row.bloodGroup}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.donorType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        row.source === "In-house"
                          ? "bg-blue-100 text-blue-800"
                          : row.source === "ROTTO-North"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {row.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : row.status === "Matching"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.retrievedAt}
                  </td>
                  <td className="px-6 py-4">
                    {row.status === "Available" || row.status === "Matching" ? (
                      <button className="text-blue-700 hover:underline font-bold text-xs">
                        View / Allocate
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
          <span>
            Showing 1–{inventoryRows.length} of {inventoryRows.length} records
          </span>
          <div className="flex gap-2">
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function AllocationStatusView() {
  const allocationRows = [
    {
      id: "REQ-2024-001",
      organType: "Kidney (L)",
      patient: "Amit Kumar (M/45)",
      score: "KDPI: 85%",
      status: "Matching",
      statusColor: "bg-blue-100 text-blue-800",
      responseDue: "—",
    },
    {
      id: "REQ-2024-002",
      organType: "Liver",
      patient: "Sarah Khan (F/32)",
      score: "MELD: 32 (High)",
      status: "Offer Received",
      statusColor: "bg-green-100 text-green-800",
      responseDue: "Today, 6:00 PM",
    },
    {
      id: "REQ-2024-003",
      organType: "Heart",
      patient: "Rajesh Singh (M/50)",
      score: "Status 1A",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-800",
      responseDue: "Tomorrow, 12:00 PM",
    },
    {
      id: "REQ-2024-004",
      organType: "Cornea (R)",
      patient: "Baby Anjali (F/05)",
      score: "Pediatric Priority",
      status: "Scheduled",
      statusColor: "bg-purple-100 text-purple-800",
      responseDue: "—",
    },
    {
      id: "REQ-2024-005",
      organType: "Kidney (R)",
      patient: "Suresh Patel (M/58)",
      score: "KDPI: 72%",
      status: "Accepted",
      statusColor: "bg-green-100 text-green-800",
      responseDue: "—",
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Allocation Status
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track allocation requests, offers, and acceptance status.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <FileText size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Awaiting Response
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">02</p>
          <p className="text-xs text-slate-500">From this hospital</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Accepted
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">01</p>
          <p className="text-xs text-slate-500">This week</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Matching
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">01</p>
          <p className="text-xs text-slate-500">In progress</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Last synced
          </p>
          <p className="text-lg font-bold text-slate-800 mt-1">10:42 AM</p>
          <p className="text-xs text-slate-500">IST</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">
            Recent Allocation Requests
          </h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Request ID or Patient..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 w-72"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">
                  Request ID
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Organ Type
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Patient Details
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Urgency Score
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Response Due
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocationRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.organType}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.patient}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                      {row.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.responseDue}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-700 hover:underline font-bold text-xs">
                      View Details
                    </button>
                    {row.status === "Offer Received" && (
                      <>
                        <span className="mx-1 text-slate-300">|</span>
                        <button className="text-green-700 hover:underline font-bold text-xs">
                          Accept
                        </button>
                        <span className="mx-1 text-slate-300">|</span>
                        <button className="text-red-700 hover:underline font-bold text-xs">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
          <span>
            Showing 1–{allocationRows.length} of {allocationRows.length} records
          </span>
          <div className="flex gap-2">
            <button className="hover:text-blue-700 font-bold">Previous</button>
            <button className="hover:text-blue-700 font-bold">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

function MandatoryReportsView() {
  const reportRows = [
    {
      type: "Form 10 (BSD Certification)",
      period: "Jan 2024",
      dueDate: "31-Jan-2024",
      status: "Submitted",
      statusColor: "bg-green-100 text-green-800",
      submittedDate: "28-Jan-2024",
    },
    {
      type: "Monthly Transplant Summary",
      period: "Jan 2024",
      dueDate: "05-Feb-2024",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-800",
      submittedDate: "—",
    },
    {
      type: "Form 12 (Registration Renewal)",
      period: "FY 2024-25",
      dueDate: "31-Mar-2024",
      status: "Pending",
      statusColor: "bg-amber-100 text-amber-800",
      submittedDate: "—",
    },
    {
      type: "Adverse Event Report",
      period: "N/A",
      dueDate: "Within 24 hrs",
      status: "Not Applicable",
      statusColor: "bg-slate-100 text-slate-600",
      submittedDate: "—",
    },
    {
      type: "Quarterly Waitlist Update",
      period: "Q4 FY 2023-24",
      dueDate: "15-Jan-2024",
      status: "Overdue",
      statusColor: "bg-red-100 text-red-800",
      submittedDate: "—",
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Mandatory Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Submit and view statutory reports (Form 10, Form 12, etc.) as per
            NOTTO guidelines.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2">
            <FileText size={16} /> Download Templates
          </button>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <FileText size={16} /> + Submit New Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Pending
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">02</p>
          <p className="text-xs text-slate-500">Due this month</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Submitted
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">01</p>
          <p className="text-xs text-slate-500">This month</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Overdue
          </p>
          <p className="text-2xl font-bold text-red-700 mt-1">01</p>
          <p className="text-xs text-slate-500">Requires action</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Last submitted
          </p>
          <p className="text-lg font-bold text-slate-800 mt-1">28-Jan-2024</p>
          <p className="text-xs text-slate-500">Form 10</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Report Registry</h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by Report Type or Period..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 w-72"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">
                  Report Type
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Period / Reference
                </th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Due Date
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Status</th>
                <th className="px-6 py-3 border-b border-slate-200">
                  Submitted Date
                </th>
                <th className="px-6 py-3 border-b border-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {row.type}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.period}</td>
                  <td className="px-6 py-4 text-slate-600">{row.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${row.statusColor}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.submittedDate}
                  </td>
                  <td className="px-6 py-4">
                    {row.status === "Submitted" ? (
                      <button className="text-blue-700 hover:underline font-bold text-xs">
                        View / Download
                      </button>
                    ) : row.status === "Pending" || row.status === "Overdue" ? (
                      <button className="text-blue-700 hover:underline font-bold text-xs">
                        Submit
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
          <span>
            Showing 1–{reportRows.length} of {reportRows.length} records
          </span>
          <div className="flex gap-2">
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="hover:text-blue-700 font-bold disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PlaceholderView({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-12 text-center">
        <p className="text-slate-500">
          This section is under development. Content will be available soon.
        </p>
      </div>
    </>
  );
}

function StatCard({ label, value, subtext, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 font-bold text-xs uppercase tracking-wide">
          {label}
        </span>
        <div className="p-2 bg-slate-50 rounded-full">{icon}</div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      </div>
    </div>
  );
}

function TableRow({ id, organ, patient, score, status, statusColor }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-600">
        {id}
      </td>
      <td className="px-6 py-4 font-bold text-slate-800">{organ}</td>
      <td className="px-6 py-4 text-slate-600">{patient}</td>
      <td className="px-6 py-4">
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
          {score}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button className="text-blue-700 hover:underline font-bold text-xs">
          View Details
        </button>
      </td>
    </tr>
  );
}
