import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X, LayoutDashboard, FolderTree, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
 
interface AdminLayoutProps {
   children: React.ReactNode;
}
 
const adminNavItems = [
   { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
   { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
   { href: '/admin/plans', icon: FileText, label: 'Plans' },
   { href: '/admin/subscriptions', icon: Users, label: 'Subscriptions' },
];
 
export function AdminLayout({ children }: AdminLayoutProps) {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const [sidebarOpen, setSidebarOpen] = useState(false);
 
   const handleLogout = () => {
     logout();
     navigate('/admin/login');
   };
 
   return (
     <div className="min-h-screen flex">
       {/* Sidebar */}
       <aside 
         className={cn(
           "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
           sidebarOpen ? "translate-x-0" : "-translate-x-full"
         )}
       >
         <div className="flex flex-col h-full">
           {/* Logo */}
           <div className="h-16 flex items-center justify-between px-4 border-b">
             <Logo size="sm" />
             <button
               className="lg:hidden p-2"
               onClick={() => setSidebarOpen(false)}
             >
               <X className="w-5 h-5" />
             </button>
           </div>
 
           {/* Navigation */}
           <nav className="flex-1 px-4 py-6 space-y-2">
             {adminNavItems.map((item) => {
               const isActive = location.pathname === item.href;
               return (
                 <Link
                   key={item.href}
                   to={item.href}
                   onClick={() => setSidebarOpen(false)}
                   className={cn(
                     "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                     isActive 
                       ? "bg-primary text-primary-foreground" 
                       : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                   )}
                 >
                   <item.icon className="w-5 h-5" />
                   {item.label}
                 </Link>
               );
             })}
           </nav>
 
           {/* User Section */}
           <div className="p-4 border-t">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                 {user?.email?.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium truncate">{user?.email}</p>
                 <p className="text-xs text-muted-foreground">Administrator</p>
               </div>
             </div>
             <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
               <LogOut className="w-4 h-4 mr-2" />
               Logout
             </Button>
           </div>
         </div>
       </aside>
 
       {/* Overlay */}
       {sidebarOpen && (
         <div
           className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
           onClick={() => setSidebarOpen(false)}
         />
       )}
 
       {/* Main Content */}
       <div className="flex-1 flex flex-col min-h-screen">
         {/* Top Bar */}
         <header className="h-16 border-b bg-card flex items-center px-4 lg:px-6">
           <button
             className="lg:hidden p-2 -ml-2 mr-2"
             onClick={() => setSidebarOpen(true)}
           >
             <Menu className="w-6 h-6" />
           </button>
           <h1 className="text-lg font-semibold">Admin Panel</h1>
         </header>
 
         {/* Page Content */}
         <main className="flex-1 p-4 lg:p-6 bg-background">
           {children}
         </main>
       </div>
     </div>
   );
}