import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import UpdateCompetitionForm from '../components/competition/UpdateCompetitionForm';
import CompetitionDetails from '../components/competition/CompetitionDetails';
import Button from '../components/ui/Button';

export default function AdminCompetitionEditPage() {
  const { id } = useParams();
  const { selectedCompetitionId } = usePlatform();
  const navigate = useNavigate();

  const compId = id || selectedCompetitionId || 'comp-002';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Mostafa khaled"
        featureModule="Feature 3 — Admin Competition & Judging Setup"
        title="Competition Details & Editable Configuration"
        description="Inspect registered competition parameters via GET and execute incremental updates via PATCH /api/v1/competitions/:id."
        route={`PATCH /api/v1/competitions/${compId}`}
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/admin/competitions/${compId}/active-control`)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Active-Team Controls
        </Button>
      </PageHeader>

      <div className="space-y-8">
        <UpdateCompetitionForm competitionId={compId} />
        <CompetitionDetails competitionId={compId} />
      </div>
    </div>
  );
}
