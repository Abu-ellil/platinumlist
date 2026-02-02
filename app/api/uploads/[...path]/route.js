import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export async function GET(request, { params }) {
    try {
        const filePath = params.path.join('/');
        const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);

        // Read the file
        const fileBuffer = await readFile(fullPath);
        
        // Determine content type
        const contentType = mime.lookup(fullPath) || 'application/octet-stream';
        
        // Return the file with proper headers
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }
} 