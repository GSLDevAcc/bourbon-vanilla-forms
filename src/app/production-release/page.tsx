// src/app/production-release/page.tsx
import dynamic from 'next/dynamic';

const ProductionReleaseForm = dynamic(
  () => import('@/components/production-release/production-release-form'),
  { ssr: false }
);

export default function ProductionReleasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductionReleaseForm />
    </div>
  );
}