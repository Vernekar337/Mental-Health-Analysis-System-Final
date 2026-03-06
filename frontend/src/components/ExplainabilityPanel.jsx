import React from "react";

const ExplainabilityPanel = ({ reasons, loading }) => {

  // Ensure reasons is always an array
  const safeReasons = Array.isArray(reasons) ? reasons : [];

  /* ---------- Loading state ---------- */

  if (loading) {
    return (

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">

        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Analysis Insights
        </h3>

        <p className="text-sm text-slate-500">
          Generating insights...
        </p>

      </div>

    );
  }

  /* ---------- Normal state ---------- */

  return (

    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">

      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Analysis Insights
      </h3>

      {safeReasons.length === 0 ? (

        <p className="text-sm text-slate-500">
          No insights available yet. Complete assessments to generate insights.
        </p>

      ) : (

        <ul className="space-y-3">

          {safeReasons.map((reason, index) => (

            <li
              key={index}
              className="text-sm text-slate-700 leading-relaxed"
            >
              • {reason}
            </li>

          ))}

        </ul>

      )}

    </div>

  );

};

export default ExplainabilityPanel;