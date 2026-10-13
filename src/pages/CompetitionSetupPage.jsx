import React, { useState } from 'react';
import CreateCompetitionForm from '../components/competition/CreateCompetitionForm';
import UpdateCompetitionForm from '../components/competition/UpdateCompetitionForm';
import CompetitionDetails from '../components/competition/CompetitionDetails';

/**
 * CompetitionSetupPage
 *
 * Admin page composing Task 1 components:
 * - Create Competition
 * - View Competition Details
 * - Update Competition
 */
export default function CompetitionSetupPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('comp-001');

  const tabs = [
    { id: 'create', label: 'Create', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )},
    { id: 'view', label: 'View Details', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )},
    { id: 'update', label: 'Update', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-surface-100 tracking-tight">Competition Setup</h1>
        <p className="text-surface-400 mt-1">Create, view, and manage competition configurations</p>
      </div>

      {/* Competition ID selector for View/Update */}
      {(activeTab === 'view' || activeTab === 'update') && (
        <div className="animate-fade-in flex items-center gap-3 p-4 glass-card">
          <label htmlFor="comp-id-select" className="text-sm font-medium text-surface-300 whitespace-nowrap">
            Competition ID:
          </label>
          <input
            id="comp-id-select"
            type="text"
            value={selectedCompetitionId}
            onChange={(e) => setSelectedCompetitionId(e.target.value)}
            placeholder="Enter competition ID"
            className="flex-1 px-4 py-2.5 bg-surface-800/60 border border-surface-700 rounded-xl text-surface-100 placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-500"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-800/40 rounded-xl border border-surface-700/30 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              text-sm font-medium rounded-lg transition-all duration-200
              cursor-pointer
              ${activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
              }
            `.trim()}
            id={`tab-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ animationDelay: '200ms' }} className="animate-fade-in-up">
        {activeTab === 'create' && (
          <CreateCompetitionForm
            onCreated={(comp) => {
              setSelectedCompetitionId(comp.id);
            }}
          />
        )}
        {activeTab === 'view' && selectedCompetitionId && (
          <CompetitionDetails
            competitionId={selectedCompetitionId}
            onEdit={() => setActiveTab('update')}
          />
        )}
        {activeTab === 'update' && selectedCompetitionId && (
          <UpdateCompetitionForm
            competitionId={selectedCompetitionId}
            onUpdated={() => {}}
          />
        )}
      </div>
    </div>
  );
}
