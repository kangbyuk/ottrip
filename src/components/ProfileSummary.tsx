'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProfileSummary() {
  const { user } = useUser();

  if (!user) return null;

  const gender = user.unsafeMetadata?.gender;
  const emoji = gender === 'female' ? '👩' : gender === 'male' ? '👨' : '';
  const nickname =
    typeof user.unsafeMetadata?.nickname === 'string'
      ? user.unsafeMetadata.nickname
      : '닉네임';

  return (
    <Link
      href="/profile"
      className="flex items-center space-x-2 hover:opacity-80"
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-medium">{nickname}</span>
    </Link>
  );
}