"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; 

type Role = "donor" | "recipient" | null;
type Step = "role" | "auth" | "profile";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  bloodType: string;
  phone: string;
  address: string;
}

export default function Register() {
  const router = useRouter();
  
  // State
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState<Step>("role");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    bloodType: "",
    phone: "",
    address: "",
  });

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors on typing
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Move to next step (Profile) instead of creating user immediately
    // This allows us to gather all data before hitting the backend
    setStep("profile");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const user = userCredential.user;

      // 2. TODO: Save extended profile (role, bloodType, etc.) to Firestore/Database here
      // Example: await setDoc(doc(db, "users", user.uid), { ...formData, role });
      
      console.log("Registered:", user.uid, role, formData);

      // 3. Redirect
      router.push("/dashboard"); 

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Steps ---

  // Step 1: Role Selection
  if (step === "role") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-800">Join our Community</h1>
          <p className="text-gray-600 text-lg">Select how you want to participate</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Donor Card */}
            <button
              onClick={() => { setRole("donor"); setStep("auth"); }}
              className="group relative flex flex-col items-center p-8 bg-white border-2 border-transparent rounded-2xl shadow-lg hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                 <span className="text-3xl group-hover:text-white">🩸</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Become a Donor</h3>
              <p className="text-gray-500 mt-2">I want to donate blood and save lives.</p>
            </button>

            {/* Recipient Card */}
            <button
              onClick={() => { setRole("recipient"); setStep("auth"); }}
              className="group relative flex flex-col items-center p-8 bg-white border-2 border-transparent rounded-2xl shadow-lg hover:border-green-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <span className="text-3xl group-hover:text-white">🏥</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">I Need Blood</h3>
              <p className="text-gray-500 mt-2">I am looking for blood donors nearby.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wrapper for Auth and Profile forms
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header / Progress */}
        <div className={`p-6 ${role === 'donor' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold capitalize">{role} Registration</h2>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Step {step === 'auth' ? '1' : '2'} of 2
            </span>
          </div>
          <p className="text-white/80 text-sm">
            {step === 'auth' ? 'Create your login credentials' : 'Tell us a bit about yourself'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {step === "auth" ? (
            // --- Step 2: Auth Form ---
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition shadow-md ${
                    role === 'donor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            // --- Step 3: Profile Form ---
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select
                    name="bloodType"
                    required
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("auth")}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition shadow-md flex justify-center items-center ${
                    role === 'donor' 
                      ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' 
                      : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}