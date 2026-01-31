import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import path from 'path';
import fs from 'fs';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'dummy_donors.json');
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'dummy_donors.json not found in project root' }, { status: 404 });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const donors = JSON.parse(fileContents);

        // Use Promise.all for parallel writes (faster than batch for < 500 items, and easier)
        // For production with massive data, use batched writes with chunking.
        const promises = donors.map(async (donor: any) => {
            // Use add() to auto-generate ID, or doc().set() if ID is provided
            return adminDb.collection('donors').add(donor);
        });

        await Promise.all(promises);

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${donors.length} donors to Firestore`,
            count: donors.length
        });
    } catch (error: any) {
        console.error('Error seeding donors:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
