import React from 'react';

const StatCard = ({ title, value, subtext, status }) => {
  // Determine border color based on status if needed, or just keep it neutral
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-slate-800">{value}</div>
      {subtext && <p className="mt-1 text-sm text-slate-600">{subtext}</p>}
    </div>
  );
};

export default StatCard;
