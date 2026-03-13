import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../db/firebase';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Invalid unsubscribe request' }, { status: 400 });
  }

  try {
    // Use email as document ID (encode to avoid illegal chars)
    const encodedEmail = encodeURIComponent(email);
    const unsubRef = doc(db, 'unsubscribed_emails', encodedEmail);
    const unsubSnap = await getDoc(unsubRef);

    if (unsubSnap.exists()) {
      return NextResponse.json({ message: 'You are already unsubscribed.' });
    }

    // Create the document to mark as unsubscribed
    await setDoc(unsubRef, { unsubscribedAt: new Date().toISOString() });

    console.log('Unsubscribed:', email);
    return NextResponse.json({ message: 'You have been unsubscribed successfully.' });
  } catch (err) {
    console.error('Error unsubscribing email:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
