import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { getAssessmentHistory } from '../../services/api';

const History = () => {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await getAssessmentHistory();

        const mapped = res.data.map((item, index) => ({
          id: index,
          date: item.date,
          score: item.mhIndex
        }));

        setHistory(mapped);

      } catch (error) {

        console.error("Failed to fetch history", error);

      } finally {

        setLoading(false);

      }

    };

    fetchHistory();

  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading History...</div>;
  }

  return (

    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Mental Health History
        </h1>
        <p className="text-slate-500 mt-1">
          Track how your mental health index has changed over time.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">

        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          MH Index Trend
        </h3>

        <div className="h-72 w-full">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={history}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis domain={[0, 100]} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#059669"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h3 className="text-lg font-semibold text-slate-800">
            Assessment Timeline
          </h3>

        </div>

        <table className="w-full text-left">

          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">

            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">MH Index</th>
            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr key={item.id} className="border-t">

                <td className="px-6 py-4 flex items-center text-slate-700">

                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />

                  {item.date}

                </td>

                <td className="px-6 py-4 font-semibold text-emerald-600">

                  {item.score}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default History;