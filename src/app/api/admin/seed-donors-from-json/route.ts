import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        // Read the dummy_donors.json file
        const filePath = path.join(process.cwd(), 'dummy_donors.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const allDonors = JSON.parse(fileContent);

        // Take only the first 20 donors
        const donorsToSeed = allDonors.slice(0, 20);

        const batch = adminDb.batch();
        const donorIds: string[] = [];

        for (const donor of donorsToSeed) {
            const docRef = adminDb.collection('donors').doc();
            batch.set(docRef, {
                ...donor,
                // Ensure registeredAt is a proper timestamp
                registeredAt: donor.registeredAt || new Date().toISOString(),
                // Add any additional fields if needed
                createdBy: 'admin-seed',
                seededAt: new Date().toISOString()
            });
            donorIds.push(docRef.id);
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${donorsToSeed.length} donors`,
            donorIds: donorIds,
            count: donorsToSeed.length
        });
    } catch (error: any) {
        console.error('Error seeding donors:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to seed donors' },
            { status: 500 }
        );
    }
}
