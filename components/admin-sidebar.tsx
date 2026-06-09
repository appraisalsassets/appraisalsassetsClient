'use client';
import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LucideIcon,
  LayoutDashboard,
  Building2,
  MessageSquare,
  FileText,
  Star,
  Users,
  FolderOpen,
  Building,
  Handshake,
  Briefcase,
  Settings,
  LogOut,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';

type PermissionKey =
  | 'dashboard'
  | 'properties'
  | 'inquiries'
  | 'blog'
  | 'testimonials'
  | 'users'
  | 'content'
  | 'developers'
  | 'settings';

const menuItems: {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: PermissionKey;
}[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    name: 'Properties',
    href: '/admin/properties',
    icon: Building2,
    permission: 'properties',
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
    permission: 'inquiries',
  },
  {
    name: 'Blog Posts',
    href: '/admin/blog',
    icon: FileText,
    permission: 'blog',
  },
  {
    name: 'Testimonials',
    href: '/admin/testimonials',
    icon: Star,
    permission: 'testimonials',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'users',
  },
  {
    name: 'Developers',
    href: '/admin/developers',
    icon: Building,
    permission: 'developers',
  },
  {
    name: 'Trusted Partners',
    href: '/admin/trusted-partners',
    icon: Handshake,
    permission: 'developers',
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: Briefcase,
    permission: 'content',
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FolderOpen,
    permission: 'content',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'settings',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, hasPermission } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-primary-dark h-screen sticky top-0 flex flex-col border-r border-primary-dark-border transition-all duration-300 z-50`}
    >
      {/* Logo - left aligned */}
      <div className="p-4 border-b border-primary-dark-border relative flex items-center justify-between gap-2">
        <Link href="/admin/dashboard" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="A&A Logo"
            width={isCollapsed ? 36 : 50}
            height={isCollapsed ? 36 : 50}
            className="block"
          />
        </Link>
        {!isCollapsed && (
          <button onClick={() => setIsCollapsed(true)} className="shrink-0 text-slate-500 hover:text-white p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Collapse Toggle (Mobile/Tablet helper or just purely header based) - Actually better to keep toggle accessible */}
      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-primary-dark-border">
           <button onClick={() => setIsCollapsed(false)} className="text-slate-500 hover:text-white">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ''}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#C1A06E] text-white shadow-lg shadow-[#C1A06E]/20'
                  : 'text-slate-400 hover:bg-primary-dark-muted hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-primary-dark-border space-y-2">
        <Link
          href="/"
          title={isCollapsed ? 'Back to Site' : ''}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-primary-dark-muted hover:text-white transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Back to Site</span>}
        </Link>
        <button
          onClick={() => logout()}
          title={isCollapsed ? 'Logout' : ''}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
