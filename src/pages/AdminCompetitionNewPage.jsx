import React from 'react';
import PageHeader from '../components/common/PageHeader';
import CreateCompetitionForm from '../components/competition/CreateCompetitionForm';

export default function AdminCompetitionNewPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Mostafa khaled"
        featureModule="Feature 3 — Admin Competition & Judging Setup"
        title="Competition Creation and Configuration"
        description="Admin UI for creating a new competition with validation, HTTP 201 Created envelope handling, and immediate transition to active judging session controls."
        route="POST /api/v1/competitions"
      />

      <CreateCompetitionForm />
    </div>
  );
}
