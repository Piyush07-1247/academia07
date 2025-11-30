import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, GraduationCap, BarChart3, LogOut, Menu, X, BookOpen, Users, UserCircle, PenTool, Sparkles, ExternalLink } from 'lucide-react';
import { auth } from '../services/auth';
import { signOut } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFloatingFooter, setShowFloatingFooter] = useState(true);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 50 && showFloatingFooter) {
      setShowFloatingFooter(false);
    } else if (scrollTop <= 50 && !showFloatingFooter) {
      setShowFloatingFooter(true);
    }
  };

  const NavItem = ({ to, icon: Icon, label, isNew = false }: { to: string; icon: any; label: string; isNew?: boolean }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)] border border-blue-500/20' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]"></div>
        )}
        <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-medium font-display tracking-wide">{label}</span>
        {isNew && (
          <span className="ml-auto text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-lg animate-pulse-glow">
            AI
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white relative overflow-hidden font-sans">
      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-500 to-cyan-500 p-1.5 rounded-lg">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg font-display tracking-tight text-white">Academia<span className="text-blue-500">07</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-300">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Glass Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0F1623]/80 backdrop-blur-2xl border-r border-white/5 
          transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black rounded-xl p-2.5 ring-1 ring-white/10">
                  <GraduationCap size={28} className="text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-2xl font-display tracking-tight text-white leading-none">Academia<span className="text-blue-500">07</span></h1>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em] mt-1">Pro Portal</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-4 mt-2">Core</div>
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/ai-tutor" icon={PenTool} label="Assignment Solver" isNew />
              
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-4 mt-6">Academic</div>
              <NavItem to="/attendance" icon={BarChart3} label="Attendance" />
              <NavItem to="/internal-marks" icon={Calculator} label="Internal Marks" />
              <NavItem to="/gpa" icon={GraduationCap} label="Grade Calc" />
              <NavItem to="/progress" icon={BookOpen} label="Progress" />
              
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-4 mt-6">Network</div>
              <NavItem to="/connections" icon={Users} label="Connections" />
              <NavItem to="/profile" icon={UserCircle} label="Profile" />
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-white/5 bg-gradient-to-t from-black/40 to-transparent">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full px-4 py-3 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className="flex-1 overflow-y-auto relative scroll-smooth"
          onScroll={handleScroll}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5">
             <div className="flex items-center gap-2 text-sm text-gray-400">
               <span className="hover:text-white transition-colors cursor-pointer">Academia07</span>
               <span>/</span>
               <span className="text-blue-400 font-medium">{location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   <Sparkles size={14} className="text-yellow-400" />
                   <span className="text-xs font-medium text-gray-300">Pro Member</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
             </div>
          </div>

          <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
            {children}
          </div>
          
          <footer className="text-center text-gray-600 text-xs py-8 border-t border-white/5 bg-[#080b12]">
            <p className="font-display">ENGINEERED BY PIYUSH GANGWAR</p>
          </footer>

          {/* Floating Footer - Shows only when not scrolled */}
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showFloatingFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
             <a 
               href="https://piyush07-pi.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 bg-blue-600/90 backdrop-blur-md text-white px-6 py-2.5 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-white/20 hover:scale-105 hover:bg-blue-500 transition-all font-display tracking-wide text-sm"
             >
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Creator Portfolio
               <ExternalLink size={12} className="ml-0.5 opacity-70" />
             </a>
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;