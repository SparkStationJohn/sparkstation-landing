import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load templates for performance
const Connect = lazy(() => import('./Connect'));
const Showcase = lazy(() => import('./Showcase'));

const TEMPLATE_MAP = {
  connect: Connect,
  showcase: Showcase
};

export default function TemplateRenderer({ profile }) {
  const TemplateComponent = TEMPLATE_MAP[profile.template_id] || Connect;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    }>
      <TemplateComponent profile={profile} content={profile.content_data || {}} />
    </Suspense>
  );
}
