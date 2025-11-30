import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Input } from '../components/UI';
import { SubjectMarks, StudentProfile, CurriculumSubject } from '../types';
import { auth } from '../services/auth';
import { getSemesterData } from '../data/curriculum';

const InternalMarks = () => {
  const [currentSem, setCurrentSem] = useState(1);
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  
  const [marks, setMarks] = useState<SubjectMarks>({
    st1: 0,
    st2: 0,
    st3: 0,
    assignments: 0,
    quizzes: 0,
    attendance: 0
  });

  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const savedProfile = localStorage.getItem(`profile_${auth.currentUser.uid}`);
      if (savedProfile) {
        const p = JSON.parse(savedProfile) as StudentProfile;
        const sem = parseInt(p.currentSemester) || 1;
        setCurrentSem(sem);
        
        const data = getSemesterData(sem);
        if (data) {
          // Filter out practicals/audits if you only want theory, but internal marks apply to all generally.
          // Usually STs are for Theory. Let's list all for now or just Theory.
          // Based on logic (ST1/ST2), this is definitely Theory.
          const theorySubs = data.subjects.filter(s => s.type === 'Theory');
          setSubjects(theorySubs);
          if (theorySubs.length > 0) {
            setSelectedSubjectCode(theorySubs[0].code);
          }
        }
      }
    }
  }, []);

  const handleChange = (field: keyof SubjectMarks, value: string) => {
    setMarks(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const calculate = () => {
    if (!auth.currentUser || !selectedSubjectCode) return;

    // Normalize ST3 to be out of 30
    const normalizedST3 = (marks.st3 * 30) / 40;
    
    const allSTs = [marks.st1, marks.st2, normalizedST3];
    // Sort descending
    allSTs.sort((a, b) => b - a);
    
    // Take top 2
    const bestTwo = allSTs.slice(0, 2);
    
    const stTotal = (bestTwo[0] * 7.5) / 30 + (bestTwo[1] * 7.5) / 30;
    
    const assignmentScore = Math.min(marks.assignments, 5);
    const quizScore = Math.min(marks.quizzes, 5);
    
    let attendanceScore = 3;
    if (marks.attendance >= 85) attendanceScore = 5;
    else if (marks.attendance >= 75) attendanceScore = 4;

    const total = stTotal + assignmentScore + quizScore + attendanceScore;
    const finalResult = parseFloat(total.toFixed(2));
    setResult(finalResult);

    // Save to LocalStorage for Dashboard
    // Format: internal_marks_{uid} = { "subject_code": result, ... }
    const key = `internal_marks_${auth.currentUser.uid}`;
    const existing = localStorage.getItem(key);
    let data = existing ? JSON.parse(existing) : {};
    data[selectedSubjectCode] = finalResult;
    localStorage.setItem(key, JSON.stringify(data));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display">Internal Marks Calculator</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold text-purple-300">Subject Details</h2>
             <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/20">
                Semester {currentSem}
             </span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Subject</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {subjects.map(s => (
                <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
              ))}
              {subjects.length === 0 && <option>No theory subjects found</option>}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input 
              label="ST1 Marks (out of 30)" 
              value={marks.st1} 
              type="number"
              onChange={(e) => handleChange('st1', e.target.value)} 
            />
            <Input 
              label="ST2 Marks (out of 30)" 
              value={marks.st2} 
              type="number"
              onChange={(e) => handleChange('st2', e.target.value)} 
            />
            <Input 
              label="ST3 Marks (out of 40)" 
              value={marks.st3} 
              type="number"
              onChange={(e) => handleChange('st3', e.target.value)} 
            />
            <Input 
              label="Attendance %" 
              value={marks.attendance} 
              type="number"
              onChange={(e) => handleChange('attendance', e.target.value)} 
            />
            <Input 
              label="Assignments (Count)" 
              value={marks.assignments} 
              type="number" max={5}
              onChange={(e) => handleChange('assignments', e.target.value)} 
            />
            <Input 
              label="Quizzes (Count)" 
              value={marks.quizzes} 
              type="number" max={5}
              onChange={(e) => handleChange('quizzes', e.target.value)} 
            />
          </div>
          <Button onClick={calculate} className="w-full mt-6" variant="secondary" disabled={!selectedSubjectCode}>
            Calculate & Save
          </Button>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="text-center h-full flex flex-col justify-center items-center">
             <h3 className="text-gray-400 font-medium uppercase tracking-widest text-sm mb-2">Total Internal Marks</h3>
             {result !== null ? (
               <>
                <div className="text-6xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                  {result}
                </div>
                <div className="text-gray-500 mt-2">out of 30</div>
                
                <div className="mt-8 text-left w-full space-y-2 text-sm text-gray-400 border-t border-white/10 pt-4">
                  <p>Breakdown:</p>
                  <div className="flex justify-between">
                    <span>Sessional Tests:</span>
                    <span className="text-white">{(((Math.max(marks.st1, marks.st2) * 7.5)/30) + ((Math.min(Math.max(marks.st1, marks.st2), (marks.st3*30)/40) * 7.5)/30)).toFixed(2)} / 15</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Assignments:</span>
                     <span className="text-white">{Math.min(marks.assignments, 5)} / 5</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Quizzes:</span>
                     <span className="text-white">{Math.min(marks.quizzes, 5)} / 5</span>
                  </div>
                </div>
               </>
             ) : (
               <p className="text-gray-500">Enter marks to calculate.</p>
             )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default InternalMarks;