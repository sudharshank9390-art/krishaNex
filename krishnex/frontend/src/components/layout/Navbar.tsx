import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Sprout, LogOut, ChevronDown, Smartphone, Scale, Shield, Settings, Bell } from 'lucide-react';
import { notificationApi, NotificationRecord } from '../../services/notificationApi';
import { subscribeToProcurementUpdates } from '../../services/realtime';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const loadNotifications = () => notificationApi.list().then((result) => { setNotifications(result.data); setUnreadCount(result.unreadCount); }).catch(() => undefined);
    loadNotifications();
    return subscribeToProcurementUpdates(loadNotifications);
  }, [user]);

  const markRead = async (notification: NotificationRecord) => {
    if (!notification.readAt) { await notificationApi.markRead(notification.id); setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item)); setUnreadCount((count) => Math.max(0, count - 1)); }
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
    
    // Navigate to respective role portal root
    const routeMap: Record<UserRole, string> = {
      FARMER: '/farmer',
      MANDI_OPERATOR: '/mandi',
      GOVERNMENT_ADMIN: '/government',
      SUPER_ADMIN: '/admin'
    };
    navigate(routeMap[role]);
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 p-0.5 shadow-lg shadow-emerald-900/15 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-emerald-700">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                KrishNex
              </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Phase 1 Preview
              </span>
            </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Smart Agriculture. Seamless Procurement.
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <Link
            to="/farmer"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/farmer') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            Farmer
          </Link>
          <Link
            to="/mandi"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/mandi') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Mandi Desk
          </Link>
          <Link
            to="/government"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/government') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            State Command
          </Link>
          <Link
            to="/mobile"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/mobile') ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile Suite
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith('/admin') ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </Link>
        </nav>

        {/* User / Role Switcher & Auth Actions */}
        <div className="flex items-center gap-3">
          {user && <div className="relative"><button title="Notifications" onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><Bell className="h-4 w-4" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-600 px-1 text-center text-[10px] font-bold text-white">{unreadCount}</span>}</button>{notificationsOpen && <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><div className="flex items-center justify-between px-3 py-2"><span className="text-xs font-bold text-slate-900">Notifications</span><span className="text-[11px] text-slate-500">{unreadCount} unread</span></div>{notifications.length === 0 ? <p className="px-3 py-4 text-xs text-slate-500">No notifications yet.</p> : notifications.slice(0, 5).map((notification) => <button key={notification.id} onClick={() => void markRead(notification)} className={`block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50 ${notification.readAt ? 'opacity-60' : ''}`}><span className="block text-xs font-bold text-slate-900">{notification.title}</span><span className="block text-[11px] text-slate-500">{notification.message}</span></button>)}</div>}</div>}
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Role: {user?.role.replace('_', ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs">
                <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Switch Active Portal
                </span>
                <button
                  onClick={() => handleRoleSelect('FARMER')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  Farmer Portal
                </button>
                <button
                  onClick={() => handleRoleSelect('MANDI_OPERATOR')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Mandi Yard Operations
                </button>
                <button
                  onClick={() => handleRoleSelect('GOVERNMENT_ADMIN')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  Government Central Command
                </button>
                <button
                  onClick={() => handleRoleSelect('SUPER_ADMIN')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  Super Administrator
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="hidden sm:flex flex-col text-right text-xs">
                <span className="font-bold text-white leading-tight">{user.name}</span>
                <span className="text-[11px] text-slate-400">{user.email}</span>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
