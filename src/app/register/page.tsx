"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "@/lib/schema";

export default function Register() {
  const [role, setRole] = useState<"donor" | "recipient" | null>(null);
  const [step, setStep] = useState<"role" | "auth" | "profile">("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // React Hook Form for profile completion
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bloodType: "O+",
      age: 30,
      location: "",
      role: "donor",
    },
  });

  useEffect(() => {
    if (role) {
      setValue("role", role);
    }
  }, [role, setValue]);

  async function handleSignup(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!auth) {
      setError("Auth not initialized");
      return;
    }
    if (!role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user: FirebaseUser = cred.user;

      // Update display name
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Save a minimal record immediately (role + name)
      try {
        if (db) {
          await setDoc(doc(db, "users", user.uid), {
            role,
            name: name || null,
            email,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error("Firestore save error", e);
      }

      setStep("profile");
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ProfileSchema) {
    setError(null);
    if (!auth) {
      setError("Auth not initialized");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setError("No authenticated user");
      return;
    }

    try {
      if (db) {
        // Still save to users collection for auth/role mapping
        await setDoc(doc(db, "users", user.uid), {
          ...data,
          email: user.email,
          updatedAt: new Date().toISOString(),
        });
      }

      // If recipient, save to backend registry (Python)
      if (role === 'recipient') {
        const response = await fetch('http://localhost:8000/registry/recipient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.uid, // Use auth uid as the document ID for consistency
            fullName: name || user.displayName || "Unknown",
            bloodGroup: data.bloodType,
            dob: new Date(new Date().getFullYear() - data.age, 0, 1).toISOString().split('T')[0], // Approximate DOB from age
            hospitalLocation: data.location,
            organRequired: "Kidney", // Default or add to form
            urgencyStatus: data.urgencyScore ? (data.urgencyScore > 7 ? "Critical (ICU)" : "Moderate") : "Moderate",
            status: "active",
            registeredAt: new Date().toISOString(),
            submissionType: "frontend-form"
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register with backend registry');
        }
      }

      // If donor, save to Next.js API -> Firebase 'donors' collection
      if (role === 'donor') {
        const response = await fetch('/api/donors/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Ensure we pass everything the API expects
            fullName: name || user.displayName || "Unknown",
            donorType: "Living", // Self-registration implies living donor usually
            bloodType: data.bloodType,
            age: data.age,
            location: data.location,
            organsWillingToDonate: ["Kidney", "Liver"], // Default for now
            email: user.email,
            phone: "N/A", // Not collected in form yet
            medicalHistory: data.comorbidities || "None",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to register donor');
        }
      }

      // Show success message
      alert("Registered Successfully");
      router.push("/dashboard");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to save profile");
    }
  }

  // Role selection
  if (step === "role") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl mb-8">Register as...</h1>
        <div className="flex gap-8">
          <button
            onClick={() => {
              setRole("donor");
              setStep("auth");
            }}
            className="bg-blue-500 text-white p-6 rounded-lg text-xl"
          >
            Donor
          </button>
          <button
            onClick={() => {
              setRole("recipient");
              setStep("auth");
            }}
            className="bg-green-500 text-white p-6 rounded-lg text-xl"
          >
            Recipient
          </button>
        </div>
      </div>
    );
  }

  // Auth
  if (step === "auth") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Sign up as a {role}</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="border p-3 rounded"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="border p-3 rounded"
              required
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name (optional)"
              className="border p-3 rounded"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("role")}
                className="px-4 py-2 rounded border"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Profile completion
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow">
        <h2 className="text-2xl mb-4">Complete Your Profile ({role})</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 flex flex-col gap-4">
          <label className="font-medium">Blood Type</label>
          <select {...register("bloodType")} className="border p-2 w-full">
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.bloodType && <div className="text-red-600">{errors.bloodType.message}</div>}

          <label className="font-medium">Age</label>
          <input type="number" {...register("age", { valueAsNumber: true })} className="border p-2 w-full" />
          {errors.age && <div className="text-red-600">{errors.age.message}</div>}

          <label className="font-medium">Location (Country/Region)</label>
          <input {...register("location")} className="border p-2 w-full" />
          {errors.location && <div className="text-red-600">{errors.location.message}</div>}

          <label className="font-medium">Comorbidities (optional)</label>
          <textarea {...register("comorbidities")} className="border p-2 w-full" />

          {role === "recipient" && (
            <>
              <label className="font-medium">Urgency Score (1-10)</label>
              <input type="range" min="1" max="10" {...register("urgencyScore", { valueAsNumber: true })} />
              {errors.urgencyScore && <div className="text-red-600">{errors.urgencyScore.message}</div>}
            </>
          )}

          <label className="font-medium">HLA Markers (optional)</label>
          <input {...register("hlaMarkers")} className="border p-2 w-full" />

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep("auth")} className="px-4 py-2 rounded border">Back</button>
            <button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white p-4 mt-4">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

