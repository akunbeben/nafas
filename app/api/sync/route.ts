import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  console.log('Received data to sync:', data);

  // In a real application, you would save this data to a database.
  // For now, we just return a success response.

  return NextResponse.json({ message: 'Sync successful' });
}
