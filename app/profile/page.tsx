'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CameraIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; image?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user) {
      fetchUserData();
    }
  }, [status, router, session]);

  const fetchUserData = async () => {
    if (!session?.user?.email) return;
    const userRef = doc(db, 'users', session.user.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      setUserData(userSnap.data() as { name: string; email: string; image?: string });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.email) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile-images/${session.user.email}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', session.user.email);
      await setDoc(userRef, { image: downloadURL, updatedAt: new Date() }, { merge: true });

      setUserData((prev) => (prev ? { ...prev, image: downloadURL } : null));
      await update();
      toast.success('Profile image updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userImage = userData?.image || session.user?.image;
  const userName = userData?.name || session.user?.name;
  const userEmail = userData?.email || session.user?.email;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="pt-16 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">Profile</h1>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraIcon className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{userName}</h2>
              <p className="text-slate-600 dark:text-slate-300">{userEmail}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <UserIcon className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Display Name</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Profile information is managed through your Google account. To update your name or email,
              please update your Google account settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}