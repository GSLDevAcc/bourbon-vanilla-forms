// src/app/production-release/page.tsx
import dynamic from 'next/dynamic';

const ProductionReleaseForm = dynamic(
  () => import('@/components/production-release/production-release-form'),
  { ssr: false }
);

export default function ProductionReleasePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <ProductionReleaseForm />
    </div>
  );
}