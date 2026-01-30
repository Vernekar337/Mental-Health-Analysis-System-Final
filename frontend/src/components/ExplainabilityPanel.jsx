import React from 'react';
import { AlertCircle, FileText, Mic, Activity } from 'lucide-react';

const ExplainabilityPanel = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
        <Activity className="h-5 w-5 text-emerald-600 mr-2" />
        Insights Breakdown
      </h3>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0">
              {insight.type === 'assessment' && <FileText className="h-5 w-5 text-blue-500" />}
              {insight.type === 'audio' && <Mic className="h-5 w-5 text-purple-500" />}
              {insight.type === 'text' && <FileText className="h-5 w-5 text-gray-500" />}
              {insight.type === 'general' && <AlertCircle className="h-5 w-5 text-amber-500" />}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{insight.title}</p>
              <p className="text-sm text-gray-500">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-md text-xs text-gray-500">
        <p>
          <strong>Note:</strong> These insights are generated based on patterns in your submitted data.
          Use this to reflect on your well-being. This is not a clinical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
