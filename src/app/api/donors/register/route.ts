import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.fullName || !data.donorType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Ensure selectedOrgans is present or handle it
        const organsWillingToDonate = data.organsWillingToDonate || [];

        const docRef = await adminDb.collection('donors').add({
            ...data,
            organsWillingToDonate,
            registeredAt: FieldValue.serverTimestamp(),
            status: 'active',
            hospitalId: 'H-204',
            submissionType: 'backend-api'
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: 'Donor registered successfully via backend'
        });
    } catch (error: any) {
        console.error('Error registering donor (backend):', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
