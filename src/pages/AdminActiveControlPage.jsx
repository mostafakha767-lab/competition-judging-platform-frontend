import React from 'react';
import { useParams } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import ActiveTeamControls from '../components/judging/ActiveTeamControls';

export default function AdminActiveControlPage() {
  const { id } = useParams();
  const { selectedCompetitionId, currentCompetition } = usePlatform();

  const compId = id || selectedCompetitionId || 'comp-002';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Mostafa khaled"
        featureModule="Feature 3 — Admin Competition & Judging Setup (Task 2)"
        title="Live Active-Team Controls, Skip & Revisit"
        description="Real-time Admin session control to designate the active presentation team, skip unprepared teams without zero score assignment, and revisit skipped or visited teams."
        route={`PATCH /active-team & POST /teams/:id/skip (${compId})`}
      />

      <ActiveTeamControls competitionId={compId} />
    </div>
  );
}
