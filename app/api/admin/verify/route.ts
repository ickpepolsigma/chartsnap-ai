import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const adminAuth = cookies().get('admin-auth')?.value;
  
  if (adminAuth === 'true') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
