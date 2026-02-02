import React from 'react';

const ExplainabilityPanel = ({ reasons }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Insights</h3>
      {(!reasons || reasons.length === 0) ? (
        <p className="text-slate-500 italic">No specific insights available for this period.</p>
      ) : (
        <ul className="space-y-3">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 mr-3"></span>
              <span className="text-slate-600 leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExplainabilityPanel;
