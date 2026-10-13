import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

// ─── 1. PARTICIPANT REGISTRATION FORM [Abdallah] ──────────────────────────────
export function ParticipantRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    github: '',
    track: 'AI / Machine Learning',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <PageHeader
        owner="Abdallah"
        featureModule="Module 2: Participant & Team Management"
        title="Participant Registration Form"
        description="Public registration gateway for competitors to submit credentials, academic affiliation, and target track."
        route="/register/participant"
      />

      <div className="glass-card p-8">
        {submitted ? (
          <div className="space-y-4">
            <Alert
              type="success"
              title="Registration Received!"
              message={`Thank you ${formData.name}. Your registration for the ${formData.track} track is pending admin review.`}
            />
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Register Another Participant
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="p-name"
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                id="p-email"
                type="email"
                label="Student Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="p-uni"
                label="University / Institution"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
              <Input
                id="p-git"
                label="GitHub / Portfolio Handle"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Competition Track</label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none"
              >
                <option>AI / Machine Learning</option>
                <option>Autonomous Robotics</option>
                <option>Cybersecurity & Forensics</option>
                <option>IoT & Embedded Systems</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Submit Registration
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── 2. REVIEW & FILTER PARTICIPANTS [Yousef] ─────────────────────────────────
export function AdminParticipantsPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const sampleParticipants = [
    { id: 'usr-101', name: 'Alex Rivera', email: 'alex@mit.edu', track: 'AI', status: 'VERIFIED', team: 'Neural Nexus' },
    { id: 'usr-102', name: 'Sara Chen', email: 'sara@stanford.edu', track: 'AI', status: 'VERIFIED', team: 'Neural Nexus' },
    { id: 'usr-103', name: 'Liam Patel', email: 'liam@cmu.edu', track: 'Quantum', status: 'VERIFIED', team: 'Quantum Coders' },
    { id: 'usr-104', name: 'Sophia Kim', email: 'sophia@berkeley.edu', track: 'Quantum', status: 'PENDING', team: 'Unassigned' },
    { id: 'usr-105', name: 'David O\'Connor', email: 'david@oxford.edu', track: 'Robotics', status: 'VERIFIED', team: 'RoboForge' },
    { id: 'usr-106', name: 'Carlos Mendez', email: 'carlos@toronto.edu', track: 'Healthcare AI', status: 'PENDING', team: 'Unassigned' },
  ];

  const filtered = sampleParticipants.filter((p) => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Yousef"
        featureModule="Module 2: Participant & Team Management"
        title="Review & Filter Participants"
        description="Admin dashboard to search, verify, and filter registered participants before assigning them to competitive teams."
        route="/admin/participants"
      />

      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <input
            type="text"
            placeholder="Search by participant name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-surface-200 placeholder-surface-500 focus:outline-none w-full sm:w-72"
          />

          <div className="flex gap-1.5 p-1 bg-surface-950 rounded-xl text-xs">
            {['ALL', 'VERIFIED', 'PENDING'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filter === f ? 'bg-primary-600 text-white' : 'text-surface-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-950/60 text-surface-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Track</th>
                <th className="p-3">Team Allocation</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-800/40">
                  <td className="p-3 font-mono text-surface-500">{p.id}</td>
                  <td className="p-3 font-semibold text-surface-200">{p.name}</td>
                  <td className="p-3 text-surface-400">{p.email}</td>
                  <td className="p-3 text-surface-300">{p.track}</td>
                  <td className="p-3 font-mono text-primary-300">{p.team}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 3. CREATE TEAMS & ASSIGN MEMBERS [Yousef] ────────────────────────────────
export function AdminTeamsPage() {
  const { currentTeams, currentCompetition } = usePlatform();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamProject, setNewTeamProject] = useState('');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        owner="Yousef"
        featureModule="Module 2: Participant & Team Management"
        title="Team Creation & Allocation"
        description="Create teams, assign verified participants, and allocate slots to the active competition."
        route="/admin/teams"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Builder Panel */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-surface-100">+ Register New Team</h3>
          <p className="text-xs text-surface-400">
            Allocate to competition: <strong className="text-primary-300">{currentCompetition?.name}</strong>
          </p>

          <Input
            id="team-builder-name"
            label="Team Name"
            placeholder="e.g., CyberVanguard"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />

          <Input
            id="team-builder-proj"
            label="Project Title"
            placeholder="e.g., Autonomous Edge Router"
            value={newTeamProject}
            onChange={(e) => setNewTeamProject(e.target.value)}
          />

          <Button
            variant="primary"
            className="w-full"
            disabled={!newTeamName.trim()}
          >
            Create Team Slot
          </Button>
        </div>

        {/* Existing Teams in Competition */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-surface-100">
              Allocated Teams in {currentCompetition?.id}
            </h3>
            <span className="text-xs text-surface-400 font-mono">
              {currentTeams.length} teams
            </span>
          </div>

          <div className="space-y-2.5">
            {currentTeams.map((t) => (
              <div
                key={t.id}
                className="p-3.5 bg-surface-900/60 rounded-xl border border-surface-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-surface-200">{t.name}</h4>
                    <span className="text-[10px] font-mono text-surface-500">{t.id}</span>
                  </div>
                  <p className="text-[11px] text-surface-400 mt-0.5">{t.projectTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-primary-300 block">
                    {t.assignedSlot}
                  </span>
                  <span className="text-[10px] text-surface-500 uppercase">{t.workflowStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
