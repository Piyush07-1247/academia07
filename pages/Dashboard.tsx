import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/UI';
import { BarChart3, Calculator, GraduationCap, BookOpen, ArrowRight, Users, BrainCircuit, Clock, Target, Activity, List, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { auth } from '../services/auth';
import { Subject, StudentProfile, CurriculumSubject } from '../types';
import { getSemesterData } from '../data/curriculum';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendance: 'NA',
    attendanceStatus: 'neutral', 
    cgpa: 'NA',
    targetSgpa: null as string | null,
    assignmentsPending: 0,
    assignmentsTotal: 0
  });
  const [assignmentDetails, setAssignmentDetails] = useState<Subject[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [performanceData, setPerformanceData] = useState<{sem: string, sgpa: number}[]>([]);
  
  // Internal Marks State
  const [internalMarks, setInternalMarks] = useState<{subject: CurriculumSubject, marks: string}[]>([]);
  const [currentSem, setCurrentSem] = useState(1);

  const date = new Date();
  const hours = date.getHours();
  let greeting = "Good Evening";
  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";

  // Load real data from other tools
  useEffect(() => {
    const savedAttend = localStorage.getItem('dashboard_attendance_val');
    const savedAttendStatus = localStorage.getItem('dashboard_attendance_status');
    const savedCgpa = localStorage.getItem('dashboard_cgpa_val');
    const savedTarget = localStorage.getItem('dashboard_target_sgpa');

    // Assignment Logic
    let pending = 0;
    let theorySubjects: Subject[] = [];
    
    if (auth.currentUser) {
      const savedProgress = localStorage.getItem(`progress_subjects_${auth.currentUser.uid}`);
      if (savedProgress) {
        const subjects = JSON.parse(savedProgress) as Subject[];
        // Filter only Theory subjects for assignment calculation
        theorySubjects = subjects.filter(s => s.isTheory);
        
        const totalPossible = theorySubjects.length * 5;
        const totalDone = theorySubjects.reduce((acc, curr) => acc + curr.assignmentsDone, 0);
        pending = totalPossible - totalDone;
      }

      // Load Academic History
      const savedHistory = localStorage.getItem(`academic_history_${auth.currentUser.uid}`);
      if (savedHistory) {
        const hist = JSON.parse(savedHistory);
        const formatted = hist.sort((a: any, b: any) => a.sem - b.sem).map((h: any) => ({
            sem: `Sem ${h.sem}`,
            sgpa: parseFloat(h.sgpa)
        }));
        setPerformanceData(formatted);
      } else {
        // Fallback or empty state
        setPerformanceData([]);
      }

      // Load Internal Marks Data
      const savedProfile = localStorage.getItem(`profile_${auth.currentUser.uid}`);
      const savedInternals = localStorage.getItem(`internal_marks_${auth.currentUser.uid}`);
      const internalData = savedInternals ? JSON.parse(savedInternals) : {};
      
      if (savedProfile) {
        const p = JSON.parse(savedProfile) as StudentProfile;
        const sem = parseInt(p.currentSemester) || 1;
        setCurrentSem(sem);
        
        const semData = getSemesterData(sem);
        if (semData) {
            const subjectsList = semData.subjects.filter(s => s.type === 'Theory').map(sub => ({
                subject: sub,
                marks: internalData[sub.code] ? internalData[sub.code].toString() : 'NA'
            }));
            setInternalMarks(subjectsList);
        }
      }
    }
    setAssignmentDetails(theorySubjects);

    setStats({
      attendance: savedAttend ? `${savedAttend}%` : 'NA',
      attendanceStatus: savedAttendStatus as any || 'neutral',
      cgpa: savedCgpa || 'NA',
      targetSgpa: savedTarget,
      assignmentsPending: pending,
      assignmentsTotal: theorySubjects.length * 5
    });
  }, []);

  const StatCard = ({ title, value, sub, icon: Icon, color, trend, action }: any) => (
    <GlassCard className="relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
           <div className={`p-2 rounded-lg bg-white/5 ${color} bg-opacity-10 text-white border border-white/10`}>
             <Icon size={20} />
           </div>
           <span className="text-gray-400 font-medium text-sm uppercase tracking-wide">{title}</span>
        </div>
        <div className="text-4xl font-bold font-display text-white mb-2 tracking-tight">{value}</div>
        <div className="flex items-center gap-2 text-xs font-medium">
           {sub}
        </div>
      </div>
      {action && (
        <div className="mt-4 pt-3 border-t border-white/5">
          {action}
        </div>
      )}
    </GlassCard>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
            {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">Scholar</span>
          </h1>
          <p className="text-gray-400 text-lg">Ready to engineer your future today?</p>
        </div>
        <GlassCard className="!p-3 !rounded-full flex items-center gap-3 pr-6 bg-blue-500/10 border-blue-500/20">
           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></div>
           <span className="text-sm font-medium text-blue-200">System Operational</span>
        </GlassCard>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            title="Attendance Avg" 
            value={stats.attendance} 
            sub={
              <span className={`${stats.attendanceStatus === 'safe' ? 'text-green-400' : stats.attendanceStatus === 'danger' ? 'text-red-400' : 'text-gray-400'} flex items-center gap-1`}>
                 {stats.attendanceStatus === 'safe' ? '▲ Safe Zone' : stats.attendanceStatus === 'danger' ? '▼ Danger Zone' : '● No Data'}
              </span>
            }
            icon={BarChart3} 
            color="text-green-400" 
            action={
              <button onClick={() => navigate('/attendance')} className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors">
                <Activity size={12} /> Simulate Future
              </button>
            }
         />
         <StatCard 
            title="Current CGPA" 
            value={stats.cgpa} 
            sub={
              stats.targetSgpa ? (
                 <span className="text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    <Target size={12} /> Next Sem Target: {stats.targetSgpa}
                 </span>
              ) : (
                <span className="text-gray-500">No Goal Set</span>
              )
            }
            icon={GraduationCap} 
            color="text-purple-400" 
            action={
              <button onClick={() => navigate('/gpa')} className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
                <Calculator size={12} /> Calculate & Simulate
              </button>
            }
         />
         <StatCard 
            title="Assignments" 
            value={`${stats.assignmentsPending} Left`} 
            sub={<span className="text-orange-400">{stats.assignmentsTotal - stats.assignmentsPending} Completed</span>}
            icon={Clock} 
            color="text-orange-400" 
            action={
              <button onClick={() => setShowAssignModal(true)} className="text-xs flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors">
                <List size={12} /> View Details
              </button>
            }
         />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold font-display">Academic Trajectory</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Semester Performance</p>
              </div>
              <button onClick={() => navigate('/gpa')} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded border border-white/10 transition-colors">
                 Update History
              </button>
            </div>
            <div className="h-72 w-full">
              {performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis 
                        dataKey="sem" 
                        stroke="#4b5563" 
                        tick={{fill: '#9ca3af', fontSize: 12}} 
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#4b5563" 
                        tick={{fill: '#9ca3af', fontSize: 12}} 
                        domain={[0, 10]} 
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 22, 35, 0.95)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px', 
                          color: '#fff',
                          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' 
                        }}
                        cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sgpa" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorSgpa)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <BarChart3 className="mb-2 opacity-20" size={48} />
                      <p>No history found.</p>
                    <p className="text-xs mt-1">Go to Grade Calc → CGPA to enter past semesters.</p>
                  </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Internal Marks Progress Card (Replaces AI Promo) */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className="text-xl font-bold font-display text-white">Internal Assessment</h2>
                    <p className="text-xs text-blue-400 font-medium">Semester {currentSem} Progress</p>
                 </div>
                 <div onClick={() => navigate('/internal-marks')} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                     <ChevronRight size={18} />
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20">
                {internalMarks.length > 0 ? (
                    internalMarks.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex-1 min-w-0 mr-2">
                                <h4 className="text-sm font-medium truncate" title={item.subject.name}>{item.subject.name}</h4>
                                <p className="text-[10px] text-gray-500">{item.subject.code}</p>
                            </div>
                            <div className={`text-sm font-bold ${item.marks === 'NA' ? 'text-gray-600' : parseFloat(item.marks) > 25 ? 'text-green-400' : 'text-white'}`}>
                                {item.marks} <span className="text-[10px] text-gray-600 font-normal">/ 30</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>No theory subjects found for this semester.</p>
                    </div>
                )}
             </div>
             
             <button 
                onClick={() => navigate('/internal-marks')}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
             >
                Update Marks
             </button>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-display text-white mt-8 flex items-center gap-3">
        <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
        Core Modules
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Attendance", icon: BarChart3, path: "/attendance", color: "text-blue-400", sub: "Calc Safe Bunks" },
          { title: "Internal Marks", icon: Calculator, path: "/internal-marks", color: "text-purple-400", sub: "Sessionals & Labs" },
          { title: "Network", icon: Users, path: "/connections", color: "text-cyan-400", sub: "Find Peers" },
          { title: "Progress", icon: BookOpen, path: "/progress", color: "text-pink-400", sub: "Track Syllabus" },
        ].map((tool, idx) => (
          <GlassCard 
            key={idx} 
            hoverEffect={true}
            className="cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-500"
          >
            <div onClick={() => navigate(tool.path)}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${tool.color}`}>
                    <tool.icon size={28} />
                   </div>
                </div>
                <ArrowRight className="text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300" />
              </div>
              
              <h3 className="text-lg font-bold font-display group-hover:text-blue-300 transition-colors">{tool.title}</h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide group-hover:text-gray-400">{tool.sub}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-lg relative border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
             <button 
               onClick={() => setShowAssignModal(false)}
               className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
             >
               <X size={18} />
             </button>
             
             <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                 <List size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Pending Assignments</h3>
                  <p className="text-sm text-gray-400">Theory Subjects Overview</p>
               </div>
             </div>

             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
               {assignmentDetails.length > 0 ? (
                 assignmentDetails.map(sub => {
                   const pending = 5 - sub.assignmentsDone;
                   return (
                     <div key={sub.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div className="flex-1">
                           <div className="text-sm font-bold text-white mb-1 truncate">{sub.name}</div>
                           <div className="text-xs text-gray-500">{sub.code}</div>
                        </div>
                        <div className="flex flex-col items-end min-w-[80px]">
                           {pending === 0 ? (
                             <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                               <CheckCircle2 size={14} /> Done
                             </span>
                           ) : (
                             <span className="text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-lg text-sm">
                               {pending} Left
                             </span>
                           )}
                           <span className="text-[10px] text-gray-600 mt-1">{sub.assignmentsDone}/5 Completed</span>
                        </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="text-center py-8 text-gray-500">
                   <p>No theory subjects found.</p>
                   <p className="text-xs mt-2">Update your Progress Tracker first.</p>
                 </div>
               )}
             </div>
             
             <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button 
                  onClick={() => navigate('/progress')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Update Progress Tracker →
                </button>
             </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
