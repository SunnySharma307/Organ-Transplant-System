import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('donors').orderBy('registeredAt', 'desc').get();

        const donors = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            registeredAt: doc.data().registeredAt?.toDate?.()?.toISOString() || doc.data().registeredAt
        }));

        return NextResponse.json(donors);
    } catch (error: any) {
        console.error('Error fetching donors:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
