'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// Separate component that uses useSearchParams
const ErrorContent = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || '404_PAGE_NOT_FOUND';

  useEffect(() => {
    setTimeout(() => {
      setProgress(24);

      setTimeout(() => {
        setProgress(54);

        setTimeout(() => {
          setProgress(94);

          setTimeout(() => {
            setProgress(100);
          }, 500);
        }, 2000);
      }, 1300);
    }, 100);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{ backgroundColor: '#0078d7' }}
    >
      <div className="w-full max-w-3xl px-8 py-16">
        <div className="mb-8 text-7xl font-light">
          <div>:(</div>
        </div>

        <p className="text-xl mb-6">
          Your PC ran into a problem and needs to restart as soon as we&apos;re
          finished collecting some error info.
        </p>

        <div className="text-xl mb-10 h-10">
          {progress < 100 ? (
            <p>{progress}% complete</p>
          ) : (
            <Link
              href="/"
              className="px-6 py-2 bg-white text-[#0078d7] font-semibold rounded hover:bg-gray-100 transition animate-fadeIn inline-block"
              onClick={() => {
                setTimeout(() => {
                  router.push('/');
                }, 1000);
              }}
            >
              Restart Windows
            </Link>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-start mb-4">
            <div className="mr-4">
              <Image
                src="/other/qr-code.svg"
                alt="QR Code"
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="text-sm">
                For more info about this issue and possible fixes, visit
                <br />
                http://windows.com/stopcode
              </p>
              <p className="text-sm mt-4">
                If you call a support person, give them this info:
              </p>
              <p className="text-sm mt-2">
                What failed: {errorCode}
                <br />
                Stop Code: PAGE_FAULT_IN_NONPAGED_AREA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0078d7]" />}>
      <ErrorContent />
    </Suspense>
  );
}
