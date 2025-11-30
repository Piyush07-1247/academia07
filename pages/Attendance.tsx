import React, { useState } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, CalendarClock } from 'lucide-react';

const Attendance = () => {
  const [total, setTotal] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [target, setTarget] = useState<string>('75');
  
  // Simulation State
  const [simAttend, setSimAttend] = useState<string>('');
  const [simMiss, setSimMiss] = useState<string>('');
  
  const [result, setResult] = useState<{
    percentage: number;
    message: string;
    status: 'safe' | 'danger';
    details?: string;
    breakdown: { name: string; value: number }[];
    isSimulation?: boolean;
  } | null>(null);

  const COLORS = ['#3b82f6', '#ef4444'];

  const generateAdvice = (a: number, t: number, r: number) => {
    const current = (a / t) * 100;
    let message = '';
    let status: 'safe' | 'danger' = 'safe';

    if (current < r) {
      status = 'danger';
      let needed = 0;
      while (((a + needed) / (t + needed)) * 100 < r) {
        needed++;
        if (needed > 500) break;
      }
      message = `You need to attend ${needed} more lectures to reach ${r}%.`;
    } else {
      status = 'safe';
      let missable = 0;
      while ((a / (t + missable)) * 100 >= r) {
        missable++;
        if (missable > 500) break;
      }
      missable--;
      message = `Hooray! You can miss ${Math.max(0, missable)} more lectures and stay above ${r}%.`;
    }
    return { message, status };
  };

  const calculateCurrent = () => {
    const t = parseFloat(total);
    const a = parseFloat(attended);
    const r = parseFloat(target);

    if (isNaN(t) || isNaN(a) || isNaN(r) || t === 0) return;

    const { message, status } = generateAdvice(a, t, r);
    const current = (a / t) * 100;

    // Save to LocalStorage for Dashboard
    localStorage.setItem('dashboard_attendance_val', current.toFixed(2));
    localStorage.setItem('dashboard_attendance_status', status);

    setResult({
      percentage: parseFloat(current.toFixed(2)),
      message,
      status,
      isSimulation: false,
      breakdown: [
        { name: 'Attended', value: a },
        { name: 'Missed', value: t - a },
      ]
    });
  };

  const calculateSimulation = () => {
    const t = parseFloat(total);
    const a = parseFloat(attended);
    const r = parseFloat(target);
    const sAttend = parseFloat(simAttend) || 0;
    const sMiss = parseFloat(simMiss) || 0;

    if (isNaN(t) || isNaN(a) || isNaN(r) || t === 0) {
      alert("Please fill in the Current Status fields first.");
      return;
    }

    const newTotal = t + sAttend + sMiss;
    const newAttended = a + sAttend;
    const newPercent = (newAttended / newTotal) * 100;
    
    const { message, status } = generateAdvice(newAttended, newTotal, r);
    const diff = newPercent - r;

    // Note: We do NOT save simulation to dashboard_attendance_val
    
    setResult({
      percentage: parseFloat(newPercent.toFixed(2)),
      message,
      status,
      isSimulation: true,
      details: `New Total: ${newTotal} | New Attended: ${newAttended} | Deviation: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`,
      breakdown: [
        { name: 'Attended', value: newAttended },
        { name: 'Missed', value: newTotal - newAttended },
      ]
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display">Attendance Calculator</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Current Status Card */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-blue-400" size={24} />
              <h2 className="text-xl font-semibold text-blue-100">Current Status</h2>
            </div>
            <div className="space-y-4">
              <Input 
                label="Total Classes Held" 
                type="number" 
                value={total} 
                onChange={(e) => setTotal(e.target.value)} 
                placeholder="e.g. 40"
              />
              <Input 
                label="Classes Attended" 
                type="number" 
                value={attended} 
                onChange={(e) => setAttended(e.target.value)} 
                placeholder="e.g. 32"
              />
              <Input 
                label="Required Percentage (%)" 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)} 
                placeholder="e.g. 75"
              />
              
              <Button onClick={calculateCurrent} className="w-full mt-4">
                Check Status
              </Button>
            </div>
          </GlassCard>

          {/* Simulation Card */}
          <GlassCard className="border-t-4 border-t-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-purple-100">Predict Future</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Attend Next" 
                type="number" 
                value={simAttend} 
                onChange={(e) => setSimAttend(e.target.value)} 
                placeholder="Lectures"
              />
              <Input 
                label="Miss Next" 
                type="number" 
                value={simMiss} 
                onChange={(e) => setSimMiss(e.target.value)} 
                placeholder="Lectures"
              />
            </div>
            <Button onClick={calculateSimulation} variant="secondary" className="w-full mt-4">
              Simulate Scenario
            </Button>
          </GlassCard>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          {result ? (
            <GlassCard className={`h-full border-2 ${result.status === 'safe' ? 'border-green-500/50' : 'border-red-500/50'} relative overflow-hidden`}>
              {result.isSimulation && (
                <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-200 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                  Simulation
                </div>
              )}
              
              <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
              
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-6xl font-bold font-display mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {result.percentage}%
                </div>
                {result.details && (
                  <p className="text-sm text-gray-400 mb-4 bg-black/20 px-3 py-1 rounded-full">
                    {result.details}
                  </p>
                )}
                <p className={`text-lg font-medium text-center ${result.status === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                  {result.message}
                </p>
              </div>
              
              <div className="h-64 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {result.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 text-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                     <span>Present ({result.breakdown[0].value})</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                     <span>Absent ({result.breakdown[1].value})</span>
                   </div>
                </div>
              </div>
            </GlassCard>
          ) : (
             <GlassCard className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500 border-2 border-dashed border-white/10">
               <Activity size={48} className="mb-4 opacity-20" />
               <p className="text-lg">Waiting for data...</p>
               <p className="text-sm mt-2 opacity-60">Enter your attendance details to calculate.</p>
             </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;