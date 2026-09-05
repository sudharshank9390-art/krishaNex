import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK_TOKENS } from '../../utils/mockData';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { mandiApi } from '../../services/mandiApi';

export const QualityTestingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token') || 'KN-2026-A027';
  const token = MOCK_TOKENS[0];
  const [moisture, setMoisture] = useState(12.4);
  const [foreignMatter, setForeignMatter] = useState(0.5);
  const [grade, setGrade] = useState<'GRADE_A' | 'GRADE_B' | 'REJECTED'>('GRADE_A');
  const [approved, setApproved] = useState(true);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setError('');
    try {
      await mandiApi.recordQuality(tokenId, moisture, approved ? grade : 'REJECTED');
      navigate(`/mandi/procurement?token=${encodeURIComponent(tokenId)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to save the quality result. Verify the weighment is complete.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-black text-white">Spectrometry Moisture & Quality Testing</h1>
        <p className="text-xs text-slate-400">Perform optical spectrometry assay, moisture check, and dockage approval.</p>
      </div>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title={`Quality Assay Inspection: ${token.tokenNumber}`} subtitle={`Produce: ${token.quota} Qtl ${token.cropName}`}>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Moisture Content (%)"
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
                  helperText="Max limit: 14.0%"
                />
                <Input
                  label="Foreign Matter / Refuse (%)"
                  type="number"
                  step="0.1"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(parseFloat(e.target.value) || 0)}
                  helperText="Max limit: 1.0%"
                />
              </div>

              <Select
                label="Assigned Quality Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                options={[
                  { value: 'GRADE_A', label: 'Grade A — Premium Fair Average Quality (FAQ)' },
                  { value: 'GRADE_B', label: 'Grade B — Standard Procurement Grade' },
                  { value: 'REJECTED', label: 'Rejected — Exceeds Moisture / Foreign Refuse Limit' },
                ]}
              />

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">QC Decision</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setApproved(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      approved ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Procurement
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproved(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      !approved ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Reject Load
                  </button>
                </div>
              </div>

              <Button onClick={handleApprove} size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Confirm QC & Finalize J-Form Settlement
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Assay Benchmarks" variant="cyan">
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Moisture Reading:</span>
                <span className="font-mono font-bold text-emerald-400">{moisture}% (Pass)</span>
              </div>
              <div className="flex justify-between">
                <span>Foreign Matter:</span>
                <span className="font-mono font-bold text-emerald-400">{foreignMatter}% (Pass)</span>
              </div>
              <div className="flex justify-between">
                <span>Assay Accuracy:</span>
                <span className="font-mono font-bold text-white">99.8% Certified</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
