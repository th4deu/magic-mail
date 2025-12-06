import { NextResponse } from 'next/server';
import { getBoxesIndex, debugGetAllKeys, debugGetStorage } from '@/lib/s3';

// GET /api/debug - Debug endpoint to see what's stored
export async function GET() {
  try {
    const index = await getBoxesIndex();
    const allKeys = debugGetAllKeys();
    const allData = debugGetStorage();

    return NextResponse.json({
      boxesIndexCount: Object.keys(index).length,
      boxesIndex: index,
      memoryStorageKeys: allKeys,
      memoryStorageData: allData,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
