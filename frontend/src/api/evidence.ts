import { EvidencePackage } from '../types/evidence';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getEvidence(incidentId: string): Promise<EvidencePackage> {
  const res = await fetch(`${API_URL}/api/evidence/${incidentId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Evidence fetch failed');
  return json.data;
}

export async function downloadEvidencePdf(incidentId: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/evidence/${incidentId}/pdf`);
  if (!res.ok) throw new Error('PDF download failed');
  return res.blob();
}
