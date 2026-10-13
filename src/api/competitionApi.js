import apiClient from './apiClient';

// ─── Mock data for development before full API integration ────────────────────

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

let mockIdCounter = 3;

const mockCompetitions = [
  {
    id: 'comp-001',
    name: 'AI Innovation Challenge 2026',
    description: 'Student AI project competition',
    status: 'DRAFT',
    activeTeamId: null,
    rubricVersion: null,
    resultsStatus: 'UNPUBLISHED',
  },
  {
    id: 'comp-002',
    name: 'Robotics Showdown',
    description: 'Annual robotics engineering competition',
    status: 'ACTIVE',
    activeTeamId: 'team-003',
    rubricVersion: 2,
    resultsStatus: 'UNPUBLISHED',
  },
];

const mockTeams = [
  { id: 'team-001', name: 'Neural Nexus', workflowStatus: 'PENDING', evaluationStatus: 'NOT_EVALUATED' },
  { id: 'team-002', name: 'Quantum Coders', workflowStatus: 'PENDING', evaluationStatus: 'NOT_EVALUATED' },
  { id: 'team-003', name: 'RoboForge', workflowStatus: 'VISITED', evaluationStatus: 'EVALUATED' },
  { id: 'team-004', name: 'DataMinds', workflowStatus: 'SKIPPED', evaluationStatus: 'NOT_EVALUATED' },
  { id: 'team-005', name: 'Circuit Breakers', workflowStatus: 'PENDING', evaluationStatus: 'NOT_EVALUATED' },
];

// ─── Competition API ──────────────────────────────────────────────────────────

/**
 * POST /api/v1/competitions
 */
export async function createCompetition({ name, description }) {
  if (USE_MOCKS) {
    await delay();
    const newComp = {
      id: `comp-${String(++mockIdCounter).padStart(3, '0')}`,
      name,
      description: description || '',
      status: 'DRAFT',
      activeTeamId: null,
      rubricVersion: null,
      resultsStatus: 'UNPUBLISHED',
    };
    mockCompetitions.push(newComp);
    return newComp;
  }
  const response = await apiClient.post('/competitions', { name, description });
  return response.data;
}

/**
 * GET /api/v1/competitions/:competitionId
 */
export async function getCompetition(competitionId) {
  if (USE_MOCKS) {
    await delay(400);
    const comp = mockCompetitions.find((c) => c.id === competitionId);
    if (!comp) {
      const err = new Error('Competition not found');
      err.code = 'NOT_FOUND';
      err.status = 404;
      err.details = [];
      throw err;
    }
    return { ...comp };
  }
  const response = await apiClient.get(`/competitions/${competitionId}`);
  return response.data;
}

/**
 * PATCH /api/v1/competitions/:competitionId
 */
export async function updateCompetition(competitionId, { name, description }) {
  if (USE_MOCKS) {
    await delay();
    const comp = mockCompetitions.find((c) => c.id === competitionId);
    if (!comp) {
      const err = new Error('Competition not found');
      err.code = 'NOT_FOUND';
      err.status = 404;
      err.details = [];
      throw err;
    }
    if (name !== undefined) comp.name = name;
    if (description !== undefined) comp.description = description;
    return { ...comp };
  }
  const response = await apiClient.patch(`/competitions/${competitionId}`, { name, description });
  return response.data;
}

// ─── Active Team API ──────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/competitions/:competitionId/active-team
 */
export async function setActiveTeam(competitionId, teamId) {
  if (USE_MOCKS) {
    await delay(400);
    const comp = mockCompetitions.find((c) => c.id === competitionId);
    if (comp) comp.activeTeamId = teamId;
    return { competitionId, activeTeamId: teamId };
  }
  const response = await apiClient.patch(`/competitions/${competitionId}/active-team`, { teamId });
  return response.data;
}

/**
 * POST /api/v1/competitions/:competitionId/teams/:teamId/skip
 */
export async function skipTeam(competitionId, teamId, reason) {
  if (USE_MOCKS) {
    await delay(500);
    const team = mockTeams.find((t) => t.id === teamId);
    if (team) {
      team.workflowStatus = 'SKIPPED';
      team.evaluationStatus = 'NOT_EVALUATED';
    }
    const comp = mockCompetitions.find((c) => c.id === competitionId);
    if (comp && comp.activeTeamId === teamId) {
      comp.activeTeamId = null;
    }
    return {
      teamId,
      workflowStatus: 'SKIPPED',
      evaluationStatus: 'NOT_EVALUATED',
    };
  }
  const response = await apiClient.post(
    `/competitions/${competitionId}/teams/${teamId}/skip`,
    { reason }
  );
  return response.data;
}

// ─── Teams helpers (for selectors) ────────────────────────────────────────────

/**
 * GET /api/v1/competitions/:competitionId/teams (mock only — for the team selector)
 */
export async function getTeams(competitionId) {
  if (USE_MOCKS) {
    await delay(300);
    return [...mockTeams];
  }
  const response = await apiClient.get(`/competitions/${competitionId}/teams`);
  return response.data;
}
