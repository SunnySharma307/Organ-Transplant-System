import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST() {
    try {
        const testPatients = [
            {
                name: "Rajesh Kumar",
                age: 45,
                bloodType: "O+",
                organ: "kidney",
                urgency: "high",
                location: "Mumbai",
                contact: "+91-9876543210",
                email: "rajesh.kumar@example.com",
                medicalHistory: "Chronic kidney disease stage 5",
                registeredAt: new Date().toISOString(),
                status: "active"
            },
            {
                name: "Priya Sharma",
                age: 32,
                bloodType: "A+",
                organ: "liver",
                urgency: "critical",
                location: "Delhi",
                contact: "+91-9876543211",
                email: "priya.sharma@example.com",
                medicalHistory: "Acute liver failure",
                registeredAt: new Date().toISOString(),
                status: "active"
            },
            {
                name: "Amit Patel",
                age: 28,
                bloodType: "B+",
                organ: "kidney",
                urgency: "medium",
                location: "Bangalore",
                contact: "+91-9876543212",
                email: "amit.patel@example.com",
                medicalHistory: "End-stage renal disease",
                registeredAt: new Date().toISOString(),
                status: "active"
            },
            {
                name: "Sunita Reddy",
                age: 50,
                bloodType: "AB+",
                organ: "heart",
                urgency: "high",
                location: "Hyderabad",
                contact: "+91-9876543213",
                email: "sunita.reddy@example.com",
                medicalHistory: "Congestive heart failure",
                registeredAt: new Date().toISOString(),
                status: "active"
            },
            {
                name: "Vikram Singh",
                age: 38,
                bloodType: "O-",
                organ: "kidney",
                urgency: "high",
                location: "Chennai",
                contact: "+91-9876543214",
                email: "vikram.singh@example.com",
                medicalHistory: "Diabetic nephropathy",
                registeredAt: new Date().toISOString(),
                status: "active"
            }
        ];

        const batch = adminDb.batch();
        const patientIds: string[] = [];

        for (const patient of testPatients) {
            const docRef = adminDb.collection('patients').doc();
            batch.set(docRef, patient);
            patientIds.push(docRef.id);
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${testPatients.length} patients`,
            patientIds: patientIds
        });
    } catch (error: any) {
        console.error('Error seeding patients:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to seed patients' },
            { status: 500 }
        );
    }
}
