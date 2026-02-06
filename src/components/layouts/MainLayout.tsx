import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X, User, FileText, Home } from 'lucide-react';
import { useState } from 'react';
 
interface MainLayoutProps {
   children: React.ReactNode;
}
 
export function MainLayout({ children }: MainLayoutProps) {
   const { user, userRole, isAuthenticated, logout } = useAuth();
   const navigate = useNavigate();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
   const handleLogout = () => {
     logout();
     navigate('/');
   };
 
   return (
     <div className="min-h-screen flex flex-col">
       {/* Header */}
       <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <Link to="/">
             <Logo size="md" />
           </Link>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-6">
             {isAuthenticated && userRole === 'customer' && (
               <>
                 <Link 
                   to="/dashboard" 
                   className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                 >
                   <Home className="w-4 h-4" />
                   Dashboard
                 </Link>
                 <Link 
                   to="/plans" 
                   className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                 >
                   <FileText className="w-4 h-4" />
                   Plans
                 </Link>
                 <Link 
                   to="/subscriptions" 
                   className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                 >
                   <User className="w-4 h-4" />
                   My Subscriptions
                 </Link>
               </>
             )}
           </nav>
 
           {/* Auth Buttons */}
           <div className="hidden md:flex items-center gap-4">
             {isAuthenticated ? (
               <div className="flex items-center gap-4">
                 <span className="text-sm text-muted-foreground">
                   {user?.email}
                 </span>
                 <Button variant="outline" size="sm" onClick={handleLogout}>
                   <LogOut className="w-4 h-4 mr-2" />
                   Logout
                 </Button>
               </div>
             ) : (
               <>
                 <Link to="/login">
                   <Button variant="ghost">Sign In</Button>
                 </Link>
                 <Link to="/register">
                   <Button>Get Started</Button>
                 </Link>
               </>
             )}
           </div>
 
           {/* Mobile Menu Button */}
           <button
             className="md:hidden p-2"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
         </div>
 
         {/* Mobile Menu */}
         {mobileMenuOpen && (
           <div className="md:hidden border-t bg-card">
             <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
               {isAuthenticated && userRole === 'customer' && (
                 <>
                   <Link 
                     to="/dashboard" 
                     className="text-foreground py-2"
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     Dashboard
                   </Link>
                   <Link 
                     to="/plans" 
                     className="text-foreground py-2"
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     Plans
                   </Link>
                   <Link 
                     to="/subscriptions" 
                     className="text-foreground py-2"
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     My Subscriptions
                   </Link>
                 </>
               )}
               {isAuthenticated ? (
                 <Button variant="outline" onClick={handleLogout}>
                   <LogOut className="w-4 h-4 mr-2" />
                   Logout
                 </Button>
               ) : (
                 <>
                   <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                     <Button variant="ghost" className="w-full">Sign In</Button>
                   </Link>
                   <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                     <Button className="w-full">Get Started</Button>
                   </Link>
                 </>
               )}
             </nav>
           </div>
         )}
       </header>
 
       {/* Main Content */}
       <main className="flex-1">
         {children}
       </main>
 
       {/* Footer */}
       <footer className="border-t bg-card">
         <div className="container mx-auto px-4 py-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <Logo size="sm" />
             <p className="text-sm text-muted-foreground">
               © {new Date().getFullYear()} TheeInsurance Portal. All rights reserved.
             </p>
           </div>
         </div>
       </footer>
     </div>
   );
}