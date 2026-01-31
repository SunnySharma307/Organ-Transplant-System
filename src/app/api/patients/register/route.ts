import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Basic validation could go here
        if (!data.fullName || !data.organRequired) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const docRef = await adminDb.collection('patients').add({
            ...data,
            registeredAt: FieldValue.serverTimestamp(),
            status: 'active',
            hospitalId: 'H-204',
            submissionType: 'backend-api'
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: 'Patient registered successfully via backend'
        });
    } catch (error: any) {
        console.error('Error registering patient (backend):', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
