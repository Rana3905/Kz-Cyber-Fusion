import { useState } from 'react';
import { ResponseAction, ActionType } from '../../types/response';
import { triggerResponse } from '../../api/response';
import { useDemoStore } from '../../store/demoStore';
import ActionButton from './ActionButton';
import ResponseLog from './ResponseLog';

const DEFAULT_ACTIONS: Omit<ResponseAction, 'id' | 'status' | 'executed_at' | 'result'>[] = [
  {
    action_type: 'block_ip',
    label: 'Block Suspicious IP',
    description: 'Block 185.220.101.47 at perimeter firewall',
    target: '185.220.101.47',
  },
  {
    action_type: 'freeze_account',
    label: 'Freeze Account',
    description: 'Suspend account aigerim.seitova@gmail.com',
    target: 'aigerim.seitova@gmail.com',
  },
  {
    action_type: 'force_password_reset',
    label: 'Force Password Reset',
    description: 'Invalidate session tokens and force re-auth',
    target: 'user_882',
  },
  {
    action_type: 'flag_transaction',
    label: 'Flag Transactions',
    description: 'Flag all transactions in past 6 hours for review',
    target: 'last_6h',
  },
  {
    action_type: 'notify_analyst',
    label: 'Notify Analyst',
    description: 'Send critical alert to on-call SOC analyst',
    target: 'soc-team@afm.kz',
  },
  {
    action_type: 'create_ticket',
    label: 'Create Investigation Ticket',
    description: 'Open formal incident ticket in tracking system',
    target: 'KCF-001',
  },
  {
    action_type: 'escalate_to_afm',
    label: 'Escalate to AFM',
    description: 'Escalate to AFM Financial Intelligence Unit',
    target: 'AFM-FIU',
  },
];

function buildInitialActions(): ResponseAction[] {
  return DEFAULT_ACTIONS.map((a, i) => ({
    ...a,
    id: `action-${i + 1}`,
    status: 'pending',
  }));
}

export default function ResponsePanel() {
  const [actions, setActions] = useState<ResponseAction[]>(buildInitialActions());
  const { incident } = useDemoStore();

  const incidentId = incident?.id || 'KCF-001';

  const executeAction = async (actionId: string, actionType: ActionType, target: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'executing' } : a))
    );

    try {
      await triggerResponse({ incident_id: incidentId, action_type: actionType, target });
    } catch {
      // Simulate success in demo mode
      await new Promise((r) => setTimeout(r, 1200));
    }

    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? { ...a, status: 'completed', executed_at: new Date().toISOString(), result: 'Executed successfully' }
          : a
      )
    );
  };

  const executeAll = async () => {
    const pending = actions.filter((a) => a.status === 'pending');
    for (const action of pending) {
      await executeAction(action.id, action.action_type, action.target);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const completedCount = actions.filter((a) => a.status === 'completed').length;
  const allDone = completedCount === actions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono font-bold text-white">Automated Response Engine</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Incident: <span className="text-cyber-green font-mono">{incidentId}</span>
              {' · '}{completedCount}/{actions.length} actions completed
            </p>
          </div>
          <button
            onClick={executeAll}
            disabled={allDone}
            className="px-4 py-2 rounded-lg bg-cyber-critical/10 border border-cyber-critical/30 text-cyber-critical font-mono text-sm hover:bg-cyber-critical/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allDone ? '✓ All Executed' : '⚡ Execute All'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-cyber-green transition-all duration-500"
            style={{ width: `${(completedCount / actions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Response Actions</div>
        <div className="space-y-2">
          {actions.map((action) => (
            <ActionButton
              key={action.id}
              actionType={action.action_type}
              label={action.label}
              description={action.description}
              status={action.status}
              onClick={() => executeAction(action.id, action.action_type, action.target)}
            />
          ))}
        </div>
      </div>

      {/* Execution log */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">Execution Log</div>
        <ResponseLog actions={actions} />
      </div>
    </div>
  );
}
