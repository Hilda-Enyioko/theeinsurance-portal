 import { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { useAuth } from '@/contexts/AuthContext';
 import { subscriptionsApi, plansApi } from '@/lib/api';
 import { PolicySubscription, InsurancePlan } from '@/types';
 import { FileText, Shield, ArrowRight, Calendar, Clock, Loader2 } from 'lucide-react';
 import { format } from 'date-fns';
 
 export default function Dashboard() {
   const { user } = useAuth();
   const [subscriptions, setSubscriptions] = useState<PolicySubscription[]>([]);
   const [featuredPlans, setFeaturedPlans] = useState<InsurancePlan[]>([]);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchData = async () => {
       try {
         const [subsRes, plansRes] = await Promise.all([
           subscriptionsApi.getAll({ page_size: 5 }),
           plansApi.getAll({ page_size: 3 }),
         ]);
         setSubscriptions(subsRes.data.results || []);
         setFeaturedPlans(plansRes.data.results || []);
       } catch (error) {
         console.error('Failed to fetch dashboard data:', error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchData();
   }, []);
 
   const activeSubscriptions = subscriptions.filter(
     (sub) => new Date(sub.end_date) >= new Date()
   );
 
   return (
     <MainLayout>
       <div className="container mx-auto px-4 py-8">
         {/* Welcome Section */}
         <div className="mb-8 animate-fade-in">
           <h1 className="text-3xl font-bold text-foreground mb-2">
             Welcome back, {user?.first_name || 'Customer'}!
           </h1>
           <p className="text-muted-foreground">
             Manage your insurance policies and explore new coverage options.
           </p>
         </div>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
         ) : (
           <>
             {/* Stats Cards */}
             <div className="grid md:grid-cols-3 gap-6 mb-8">
               <Card className="animate-slide-up" style={{ animationDelay: '0ms' }}>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">
                     Active Policies
                   </CardTitle>
                   <Shield className="w-5 h-5 text-primary" />
                 </CardHeader>
                 <CardContent>
                   <p className="text-3xl font-bold text-foreground">{activeSubscriptions.length}</p>
                 </CardContent>
               </Card>
 
               <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">
                     Total Subscriptions
                   </CardTitle>
                   <FileText className="w-5 h-5 text-primary" />
                 </CardHeader>
                 <CardContent>
                   <p className="text-3xl font-bold text-foreground">{subscriptions.length}</p>
                 </CardContent>
               </Card>
 
               <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">
                     Available Plans
                   </CardTitle>
                   <Clock className="w-5 h-5 text-primary" />
                 </CardHeader>
                 <CardContent>
                   <p className="text-3xl font-bold text-foreground">{featuredPlans.length}+</p>
                 </CardContent>
               </Card>
             </div>
 
             {/* Recent Subscriptions */}
             <div className="grid lg:grid-cols-2 gap-8">
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <CardTitle>Recent Subscriptions</CardTitle>
                       <CardDescription>Your latest policy subscriptions</CardDescription>
                     </div>
                     <Link to="/subscriptions">
                       <Button variant="ghost" size="sm">
                         View All
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </Link>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {subscriptions.length > 0 ? (
                     <div className="space-y-4">
                       {subscriptions.slice(0, 3).map((sub) => (
                         <div
                           key={sub.id}
                           className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                         >
                           <div>
                             <p className="font-medium text-foreground">
                               {sub.insurance_plan_name || `Plan #${sub.insurance_plan}`}
                             </p>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                               <Calendar className="w-4 h-4" />
                               {format(new Date(sub.start_date), 'MMM d, yyyy')} - {format(new Date(sub.end_date), 'MMM d, yyyy')}
                             </div>
                           </div>
                           <span
                             className={`px-2 py-1 rounded-full text-xs font-medium ${
                               new Date(sub.end_date) >= new Date()
                                 ? 'bg-success/20 text-success'
                                 : 'bg-muted text-muted-foreground'
                             }`}
                           >
                             {new Date(sub.end_date) >= new Date() ? 'Active' : 'Expired'}
                           </span>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8">
                       <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                       <p className="text-muted-foreground mb-4">No subscriptions yet</p>
                       <Link to="/plans">
                         <Button>Browse Plans</Button>
                       </Link>
                     </div>
                   )}
                 </CardContent>
               </Card>
 
               {/* Featured Plans */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <div>
                       <CardTitle>Featured Plans</CardTitle>
                       <CardDescription>Explore our popular insurance options</CardDescription>
                     </div>
                     <Link to="/plans">
                       <Button variant="ghost" size="sm">
                         All Plans
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </Link>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {featuredPlans.length > 0 ? (
                     <div className="space-y-4">
                       {featuredPlans.map((plan) => (
                         <Link
                           key={plan.id}
                           to={`/plans/${plan.id}`}
                           className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-secondary/30 transition-colors"
                         >
                           <div>
                             <p className="font-medium text-foreground">{plan.name}</p>
                             <p className="text-sm text-muted-foreground">
                               {plan.duration_months} months coverage
                             </p>
                           </div>
                           <p className="text-lg font-bold text-primary">
                             ${plan.price}
                           </p>
                         </Link>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8">
                       <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                       <p className="text-muted-foreground">No plans available</p>
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           </>
         )}
       </div>
     </MainLayout>
   );
 }