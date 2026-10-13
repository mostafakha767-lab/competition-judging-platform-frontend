import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PlatformContext = createContext(null);

// Initial mock data
const INITIAL_COMPETITIONS = [
  {
    id: 'comp-001',
    name: 'AI Innovation Challenge 2026',
    description: 'Student AI & Generative Intelligence project competition',
    status: 'DRAFT',
    activeTeamId: null,
    rubricVersion: null,
    resultsStatus: 'UNPUBLISHED',
    createdAt: '2026-10-10T09:00:00Z',
  },
  {
    id: 'comp-002',
    name: 'Robotics Showdown 2026',
    description: 'Annual autonomous robotics and embedded engineering competition',
    status: 'ACTIVE',
    activeTeamId: 'team-003',
    rubricVersion: 2,
    resultsStatus: 'UNPUBLISHED',
    createdAt: '2026-10-11T10:30:00Z',
  },
  {
    id: 'comp-003',
    name: 'CyberSec CTF Challenge',
    description: 'National collegiate ethical hacking and defense hackathon',
    status: 'ACTIVE',
    activeTeamId: 'team-006',
    rubricVersion: 1,
    resultsStatus: 'PUBLISHED',
    createdAt: '2026-10-08T14:15:00Z',
  },
];

const INITIAL_TEAMS = [
  {
    id: 'team-001',
    competitionId: 'comp-002',
    name: 'Neural Nexus',
    projectTitle: 'Real-time Autonomous Quadcopter Navigation',
    workflowStatus: 'PENDING',
    evaluationStatus: 'NOT_EVALUATED',
    score: null,
    members: ['Alex Rivera', 'Sara Chen'],
    category: 'Autonomous Systems',
    assignedSlot: '10:00 AM - Slot 1',
  },
  {
    id: 'team-002',
    competitionId: 'comp-002',
    name: 'Quantum Coders',
    projectTitle: 'Quantum Optimization for Power Grids',
    workflowStatus: 'PENDING',
    evaluationStatus: 'NOT_EVALUATED',
    score: null,
    members: ['Liam Patel', 'Sophia Kim'],
    category: 'Quantum Computing',
    assignedSlot: '10:30 AM - Slot 2',
  },
  {
    id: 'team-003',
    competitionId: 'comp-002',
    name: 'RoboForge',
    projectTitle: 'Modular Prosthetic Bionic Arm with EMG feedback',
    workflowStatus: 'VISITED',
    evaluationStatus: 'EVALUATED',
    score: 93.4,
    members: ['David O\'Connor', 'Elena Rostova'],
    category: 'Robotics & Hardware',
    assignedSlot: '11:00 AM - Slot 3',
  },
  {
    id: 'team-004',
    competitionId: 'comp-002',
    name: 'DataMinds',
    projectTitle: 'Predictive Medical Diagnostics Pipeline',
    workflowStatus: 'SKIPPED',
    evaluationStatus: 'NOT_EVALUATED',
    score: null,
    skipReason: 'Hardware reboot required; presentation laptop display failed at slot time.',
    members: ['Carlos Mendez', 'Amina Yusuf'],
    category: 'Healthcare AI',
    assignedSlot: '11:30 AM - Slot 4',
  },
  {
    id: 'team-005',
    competitionId: 'comp-002',
    name: 'Circuit Breakers',
    projectTitle: 'Smart IoT Grid Surge Predictor',
    workflowStatus: 'PENDING',
    evaluationStatus: 'NOT_EVALUATED',
    score: null,
    members: ['Maya Lin', 'Ethan Vance'],
    category: 'IoT & Smart Cities',
    assignedSlot: '12:00 PM - Slot 5',
  },
  {
    id: 'team-006',
    competitionId: 'comp-003',
    name: 'CyberShield',
    projectTitle: 'Zero-Trust Intrusion Detection System',
    workflowStatus: 'VISITED',
    evaluationStatus: 'EVALUATED',
    score: 96.2,
    members: ['Faris Al-Mansoor', 'Omar Zaki'],
    category: 'Cybersecurity',
    assignedSlot: '02:00 PM - Slot 1',
  },
  {
    id: 'team-007',
    competitionId: 'comp-003',
    name: 'ZeroDay Seekers',
    projectTitle: 'Automated Fuzzing Engine for WebAssembly',
    workflowStatus: 'VISITED',
    evaluationStatus: 'EVALUATED',
    score: 89.0,
    members: ['Hassan Nabil', 'Laila Tarek'],
    category: 'Cybersecurity',
    assignedSlot: '02:30 PM - Slot 2',
  },
];

export function PlatformProvider({ children }) {
  const [competitions, setCompetitions] = useState(INITIAL_COMPETITIONS);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('comp-002');
  const [apiActivityLog, setApiActivityLog] = useState([]);

  // Helper to log API envelope interactions
  const logApiEvent = useCallback((method, url, requestBody, responseEnvelope) => {
    const entry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      requestBody,
      responseEnvelope,
    };
    setApiActivityLog((prev) => [entry, ...prev.slice(0, 49)]);
  }, []);

  // 1. Create Competition (POST /api/v1/competitions)
  const createCompetition = useCallback(async ({ name, description }) => {
    await new Promise((r) => setTimeout(r, 400));
    const newId = `comp-${String(competitions.length + 1).padStart(3, '0')}`;
    const newComp = {
      id: newId,
      name,
      description: description || '',
      status: 'DRAFT',
      activeTeamId: null,
      rubricVersion: null,
      resultsStatus: 'UNPUBLISHED',
      createdAt: new Date().toISOString(),
    };

    // Auto-seed sample teams for this new competition for testing
    const seededTeams = [
      {
        id: `team-${newId}-01`,
        competitionId: newId,
        name: `Alpha Innovations (${name})`,
        projectTitle: 'Prototype Solution Alpha',
        workflowStatus: 'PENDING',
        evaluationStatus: 'NOT_EVALUATED',
        score: null,
        members: ['Member A', 'Member B'],
        category: 'General',
        assignedSlot: '01:00 PM - Slot 1',
      },
      {
        id: `team-${newId}-02`,
        competitionId: newId,
        name: `Beta Innovators (${name})`,
        projectTitle: 'Prototype Solution Beta',
        workflowStatus: 'PENDING',
        evaluationStatus: 'NOT_EVALUATED',
        score: null,
        members: ['Member C', 'Member D'],
        category: 'General',
        assignedSlot: '01:30 PM - Slot 2',
      },
      {
        id: `team-${newId}-03`,
        competitionId: newId,
        name: `Gamma Dynamics (${name})`,
        projectTitle: 'Prototype Solution Gamma',
        workflowStatus: 'PENDING',
        evaluationStatus: 'NOT_EVALUATED',
        score: null,
        members: ['Member E', 'Member F'],
        category: 'General',
        assignedSlot: '02:00 PM - Slot 3',
      },
    ];

    setCompetitions((prev) => [...prev, newComp]);
    setTeams((prev) => [...prev, ...seededTeams]);
    setSelectedCompetitionId(newId);

    const envelope = {
      success: true,
      data: newComp,
    };
    logApiEvent('POST', '/api/v1/competitions', { name, description }, envelope);
    return newComp;
  }, [competitions.length, logApiEvent]);

  // 2. Update Competition (PATCH /api/v1/competitions/:id)
  const updateCompetition = useCallback(async (competitionId, { name, description }) => {
    await new Promise((r) => setTimeout(r, 350));
    let updatedComp = null;
    setCompetitions((prev) =>
      prev.map((c) => {
        if (c.id === competitionId) {
          updatedComp = {
            ...c,
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description } : {}),
          };
          return updatedComp;
        }
        return c;
      })
    );

    const envelope = {
      success: true,
      data: updatedComp,
    };
    logApiEvent('PATCH', `/api/v1/competitions/${competitionId}`, { name, description }, envelope);
    return updatedComp;
  }, [logApiEvent]);

  // 3. Set Active Team (PATCH /api/v1/competitions/:id/active-team)
  const setActiveTeam = useCallback(async (competitionId, teamId) => {
    await new Promise((r) => setTimeout(r, 300));

    setCompetitions((prev) =>
      prev.map((c) => (c.id === competitionId ? { ...c, activeTeamId: teamId } : c))
    );

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          // If the team was previously skipped or pending, moving to active marks it visited
          return {
            ...t,
            workflowStatus: 'VISITED',
          };
        }
        return t;
      })
    );

    const responseData = { competitionId, activeTeamId: teamId };
    const envelope = {
      success: true,
      data: responseData,
    };
    logApiEvent('PATCH', `/api/v1/competitions/${competitionId}/active-team`, { teamId }, envelope);
    return responseData;
  }, [logApiEvent]);

  // 4. Skip Team (POST /api/v1/competitions/:id/teams/:teamId/skip)
  // DOMAIN RULE:
  // Skipping a team sets workflowStatus to "SKIPPED" and evaluationStatus to "NOT_EVALUATED".
  // It MUST NOT mark the team as evaluated, and MUST NOT assign a score of zero.
  const skipTeam = useCallback(async (competitionId, teamId, reason) => {
    await new Promise((r) => setTimeout(r, 400));

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            workflowStatus: 'SKIPPED',
            evaluationStatus: 'NOT_EVALUATED',
            skipReason: reason,
            // Score remains untouched (score: null or existing, never 0)
          };
        }
        return t;
      })
    );

    setCompetitions((prev) =>
      prev.map((c) => {
        if (c.id === competitionId && c.activeTeamId === teamId) {
          return { ...c, activeTeamId: null };
        }
        return c;
      })
    );

    const responseData = {
      teamId,
      workflowStatus: 'SKIPPED',
      evaluationStatus: 'NOT_EVALUATED',
      reason,
    };
    const envelope = {
      success: true,
      data: responseData,
    };
    logApiEvent('POST', `/api/v1/competitions/${competitionId}/teams/${teamId}/skip`, { reason }, envelope);
    return responseData;
  }, [logApiEvent]);

  // 5. Revisit Team interaction (navigates back and sets active)
  const revisitTeam = useCallback(async (competitionId, teamId) => {
    return await setActiveTeam(competitionId, teamId);
  }, [setActiveTeam]);

  // Selected competition and its teams
  const currentCompetition = useMemo(() => {
    return competitions.find((c) => c.id === selectedCompetitionId) || competitions[0] || null;
  }, [competitions, selectedCompetitionId]);

  const currentTeams = useMemo(() => {
    if (!currentCompetition) return [];
    return teams.filter((t) => t.competitionId === currentCompetition.id);
  }, [teams, currentCompetition]);

  const activeTeam = useMemo(() => {
    if (!currentCompetition?.activeTeamId) return null;
    return teams.find((t) => t.id === currentCompetition.activeTeamId) || null;
  }, [teams, currentCompetition]);

  const value = useMemo(
    () => ({
      competitions,
      teams,
      selectedCompetitionId,
      setSelectedCompetitionId,
      currentCompetition,
      currentTeams,
      activeTeam,
      apiActivityLog,
      createCompetition,
      updateCompetition,
      setActiveTeam,
      skipTeam,
      revisitTeam,
      logApiEvent,
    }),
    [
      competitions,
      teams,
      selectedCompetitionId,
      currentCompetition,
      currentTeams,
      activeTeam,
      apiActivityLog,
      createCompetition,
      updateCompetition,
      setActiveTeam,
      skipTeam,
      revisitTeam,
      logApiEvent,
    ]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
