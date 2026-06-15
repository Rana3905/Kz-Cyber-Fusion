import { useState } from 'react';
import { downloadEvidencePdf } from '../../api/evidence';

interface ExportButtonProps {
  incidentId: string;
}

export default function ExportButton({ incidentId }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const blob = await downloadEvidencePdf(incidentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-${incidentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // In demo mode — show a mock download notification
      alert(`Evidence report for ${incidentId} would be downloaded as PDF.\n(Backend PDF generation via ReportLab)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono text-sm hover:bg-cyber-green/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-cyber-green/30 border-t-cyber-green animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <span>⬇</span>
          Export Evidence PDF
        </>
      )}
    </button>
  );
}
