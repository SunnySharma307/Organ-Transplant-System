import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('recipients').orderBy('registeredAt', 'desc').get();

        const patients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // specific fields normalization if needed
            registeredAt: doc.data().registeredAt?.toDate?.()?.toISOString() || doc.data().registeredAt
        }));

        return NextResponse.json(patients);
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
