export type ActionType =
  | 'block_ip'
  | 'freeze_account'
  | 'force_password_reset'
  | 'flag_transaction'
  | 'notify_analyst'
  | 'create_ticket'
  | 'escalate_to_afm';

export type ActionStatus = 'pending' | 'executing' | 'completed' | 'failed';

export interface ResponseAction {
  id: string;
  action_type: ActionType;
  label: string;
  description: string;
  target: string;
  status: ActionStatus;
  executed_at?: string;
  result?: string;
}

export interface ResponseTriggerRequest {
  incident_id: string;
  action_type: ActionType;
  target?: string;
}

export interface ResponseTriggerResult {
  action_id: string;
  status: ActionStatus;
  message: string;
  executed_at: string;
}
