import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categoriesApi, plansApi, subscriptionsApi } from '@/lib/api';
import { FolderTree, FileText, Users, TrendingUp, Loader2 } from 'lucide-react';
 
export default function AdminDashboard() {
   const [stats, setStats] = useState({
     categories: 0,
     plans: 0,
     subscriptions: 0,
   });
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchStats = async () => {
       try {
         const [catsRes, plansRes, subsRes] = await Promise.all([
           categoriesApi.getAll({ page_size: 1 }),
           plansApi.getAll({ page_size: 1 }),
           subscriptionsApi.getAll({ page_size: 1 }),
         ]);
         setStats({
           categories: catsRes.data.count || (catsRes.data.results?.length || 0),
           plans: plansRes.data.count || 0,
           subscriptions: subsRes.data.count || 0,
         });
       } catch (error) {
         console.error('Failed to fetch stats:', error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchStats();
   }, []);
 
   const statCards = [
     {
       title: 'Property Categories',
       value: stats.categories,
       icon: FolderTree,
       description: 'Total categories created',
     },
     {
       title: 'Insurance Plans',
       value: stats.plans,
       icon: FileText,
       description: 'Active insurance plans',
     },
     {
       title: 'Subscriptions',
       value: stats.subscriptions,
       icon: Users,
       description: 'Total policy subscriptions',
     },
     {
       title: 'Growth',
       value: '+12%',
       icon: TrendingUp,
       description: 'Month over month',
     },
   ];
 
   return (
     <AdminLayout>
       <div className="space-y-8">
         <div>
           <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
           <p className="text-muted-foreground mt-1">
             Overview of your insurance portal
           </p>
         </div>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
         ) : (
           <>
             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {statCards.map((stat, index) => (
                 <Card 
                   key={stat.title} 
                   className="animate-slide-up"
                   style={{ animationDelay: `${index * 100}ms` }}
                 >
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium text-muted-foreground">
                       {stat.title}
                     </CardTitle>
                     <stat.icon className="w-5 h-5 text-primary" />
                   </CardHeader>
                   <CardContent>
                     <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                     <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                   </CardContent>
                 </Card>
               ))}
             </div>
 
             <div className="grid lg:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle>Quick Actions</CardTitle>
                   <CardDescription>Common administrative tasks</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                     <h4 className="font-medium text-foreground">Add New Plan</h4>
                     <p className="text-sm text-muted-foreground">Create a new insurance plan</p>
                   </div>
                   <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                     <h4 className="font-medium text-foreground">Manage Categories</h4>
                     <p className="text-sm text-muted-foreground">Add or edit property categories</p>
                   </div>
                   <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                     <h4 className="font-medium text-foreground">View Subscriptions</h4>
                     <p className="text-sm text-muted-foreground">Review all customer subscriptions</p>
                   </div>
                 </CardContent>
               </Card>
 
               <Card>
                 <CardHeader>
                   <CardTitle>Recent Activity</CardTitle>
                   <CardDescription>Latest updates in the system</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {[
                       { text: 'New subscription created', time: '2 minutes ago' },
                       { text: 'Plan "Premium Home" updated', time: '1 hour ago' },
                       { text: 'New category added', time: '3 hours ago' },
                       { text: 'Customer registered', time: '5 hours ago' },
                     ].map((activity, i) => (
                       <div key={i} className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-primary" />
                         <div className="flex-1">
                           <p className="text-sm text-foreground">{activity.text}</p>
                           <p className="text-xs text-muted-foreground">{activity.time}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             </div>
           </>
         )}
       </div>
     </AdminLayout>
   );
}