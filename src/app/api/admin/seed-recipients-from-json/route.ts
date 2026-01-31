import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        // Read the dummy_recipients.json file
        const filePath = path.join(process.cwd(), 'dummy_recipients.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const allRecipients = JSON.parse(fileContent);

        // Take only the first 20 recipients
        const recipientsToSeed = allRecipients.slice(0, 20);

        const batch = adminDb.batch();
        const recipientIds: string[] = [];

        for (const recipient of recipientsToSeed) {
            const docRef = adminDb.collection('recipients').doc();
            batch.set(docRef, {
                ...recipient,
                // Ensure registeredAt is a proper timestamp
                registeredAt: recipient.registeredAt || new Date().toISOString(),
                // Add any additional fields if needed
                createdBy: 'admin-seed',
                seededAt: new Date().toISOString()
            });
            recipientIds.push(docRef.id);
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${recipientsToSeed.length} recipients`,
            recipientIds: recipientIds,
            count: recipientsToSeed.length
        });
    } catch (error: any) {
        console.error('Error seeding recipients:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to seed recipients' },
            { status: 500 }
        );
    }
}
