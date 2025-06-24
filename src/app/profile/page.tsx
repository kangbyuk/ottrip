'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const meta = user.unsafeMetadata;
      if (typeof meta?.nickname === 'string') setNickname(meta.nickname);
      if (meta?.gender === 'female' || meta?.gender === 'male') setGender(meta.gender);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!/^[a-zA-Z]+$/.test(nickname.trim())) {
      setError('별명은 영어로만 설정이 가능합니다.');
      return;
    }

    setError('');

    try {
      await user?.update({
        unsafeMetadata: {
          nickname: nickname.trim(),
          gender,
        },
      });

      setSuccess(true);
      router.push('/'); // 저장 후 홈으로 이동
    } catch (err) {
      console.error('업데이트 실패:', err);
    }
  };

  const handleLogout = async () => {
    const confirmed = confirm('정말로 로그아웃하시겠습니까?');
    if (confirmed) {
      await signOut();
      router.push('/sign-in');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">프로필 설정</h2>

      <label className="block mb-1 font-medium">별명 (영어만 가능)</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded mb-2`}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <label className="block mb-1 font-medium">성별</label>
      <div className="flex space-x-4 mb-4">
        <label>
          <input
            type="radio"
            value="male"
            checked={gender === 'male'}
            onChange={() => setGender('male')}
            className="mr-1"
          />
          남자
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={gender === 'female'}
            onChange={() => setGender('female')}
            className="mr-1"
          />
          여자
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        저장
      </button>

      <button
        onClick={handleLogout}
        className="w-full mt-4 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
      >
        로그아웃
      </button>

      {success && (
        <p className="text-green-600 text-sm mt-3">프로필이 저장되었습니다.</p>
      )}
    </div>
  );
}