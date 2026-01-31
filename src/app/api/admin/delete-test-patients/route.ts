import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST() {
    try {
        // Get all patients
        const snapshot = await adminDb.collection('patients').get();

        const batch = adminDb.batch();
        let deleteCount = 0;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            // Delete only the test patients we just created
            const testEmails = [
                "rajesh.kumar@example.com",
                "priya.sharma@example.com",
                "amit.patel@example.com",
                "sunita.reddy@example.com",
                "vikram.singh@example.com"
            ];

            if (testEmails.includes(data.email)) {
                batch.delete(doc.ref);
                deleteCount++;
            }
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Deleted ${deleteCount} test patients`,
            deletedCount: deleteCount
        });
    } catch (error: any) {
        console.error('Error deleting test patients:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete test patients' },
            { status: 500 }
        );
    }
}
