
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";

// Define profiles data locally to avoid dependencies on Next.js constructs if importing from route
const profiles = [
    {
        "id": 3248,
        "role": "recipient",
        "blood_type": "AB+",
        "age": 32,
        "location": "USA-New York",
        "comorbidities": "Diabetes",
        "hla_markers": "5/4 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797525",
        "urgency_score": 7
    },
    {
        "id": 7211,
        "role": "recipient",
        "blood_type": "AB+",
        "age": 25,
        "location": "USA-New York",
        "comorbidities": "Heart Disease",
        "hla_markers": "1/4 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797568",
        "urgency_score": 7
    },
    {
        "id": 4121,
        "role": "recipient",
        "blood_type": "AB+",
        "age": 72,
        "location": "Asia-India",
        "comorbidities": "None",
        "hla_markers": "1/5 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797589",
        "urgency_score": 6
    },
    {
        "id": 6561,
        "role": "recipient",
        "blood_type": "B-",
        "age": 35,
        "location": "USA-California",
        "comorbidities": "None",
        "hla_markers": "4/6 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797605",
        "urgency_score": 7
    },
    {
        "id": 6036,
        "role": "donor",
        "blood_type": "O-",
        "age": 75,
        "location": "Africa-South Africa",
        "comorbidities": "Hypertension",
        "hla_markers": "3/6 HLA match potential",
        "created_at": "2026-01-30T17:42:51.797619"
    }
];

async function seed() {
    console.log("Starting database seed...");

    // Initialize Admin SDK specifically for this script
    // We reproduce initialization here to avoid import issues with Next.js environment variables or paths
    const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");

    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccountPath),
        });
    }

    const db = getFirestore();
    const batch = db.batch();
    const collectionRef = db.collection("profiles");

    profiles.forEach((profile) => {
        // Use ID as document ID
        const docRef = collectionRef.doc(profile.id.toString());
        batch.set(docRef, profile);
    });

    await batch.commit();
    console.log(`Successfully seeded ${profiles.length} profiles to Firestore.`);
}

seed().catch(console.error);
