// src/pages/reports/Reports.tsx
import React, { useState } from 'react';
import { reportsAPI } from '../../services/api';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';
import { useQuery } from '@tanstack/react-query';

interface ReportItem {
  filename: string;
  path?: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'financial' | 'expense' | 'invest'>('financial');
  const [generating, setGenerating] = useState(false);

  const {
    data: reports,
    refetch: refetchReports,
    isLoading: reportsLoading,
  } = useQuery<ReportItem[]>({
    queryKey: ['reportsList'],
    queryFn: () => reportsAPI.listReports(),
  });

  const generateReport = async () => {
    setGenerating(true);
    try {
      await reportsAPI.generateReport({ report_type: reportType });
      await refetchReports();
    } finally {
      setGenerating(false);
    }
  };

  // Download handler
  const downloadReport = (filename: string) => {
    reportsAPI.downloadReport(filename).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Generate & Download Reports</h1>
        <p className="mt-2 text-gray-600">
          Create detailed financial reports and download previously generated ones.
        </p>
      </div>

      {/* Generate Report */}
      <Card>
        <CardHeader title="Generate Report" />
        <CardBody>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
            >
              <option value="financial">Financial Report</option>
              <option value="expense">Expense Report</option>
              <option value="invest">Investment Report</option>
            </select>
            <Button
              onClick={generateReport}
              disabled={generating}
              className="w-full sm:w-auto"
              variant="primary"
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader title="Available Reports" />
        <CardBody>
          {reportsLoading ? (
            <p className="text-center text-gray-500 py-6">Loading reports…</p>
          ) : !reports || reports.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No reports generated yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reports.map(({ filename }) => (
                <li
                  key={filename}
                  className="flex justify-between items-center py-3 hover:bg-gray-50 rounded px-4 cursor-pointer transition"
                >
                  <span className="truncate max-w-xs">{filename}</span>
                  <Button variant="secondary" onClick={() => downloadReport(filename)}>
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;
