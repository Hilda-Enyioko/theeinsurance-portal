import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { subscriptionsApi } from '@/lib/api';
import { PolicySubscription, PaginatedResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
 
 export default function AdminSubscriptions() {
   const { toast } = useToast();
   const [subscriptions, setSubscriptions] = useState<PolicySubscription[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const pageSize = 10;
 
   const fetchSubscriptions = async () => {
     setIsLoading(true);
     try {
       const res = await subscriptionsApi.getAll({ page, page_size: pageSize });
       const data = res.data as PaginatedResponse<PolicySubscription>;
       setSubscriptions(data.results || []);
       setTotalPages(Math.ceil((data.count || 0) / pageSize));
     } catch (error) {
       console.error('Failed to fetch subscriptions:', error);
     } finally {
       setIsLoading(false);
     }
   };
 
   useEffect(() => {
     fetchSubscriptions();
   }, [page]);
 
   const handleDelete = async (id: number) => {
     if (!confirm('Are you sure you want to delete this subscription?')) return;
     
     try {
       await subscriptionsApi.delete(id);
       toast({ title: 'Success', description: 'Subscription deleted successfully' });
       fetchSubscriptions();
     } catch (error) {
       console.error('Failed to delete subscription:', error);
       toast({ title: 'Error', description: 'Failed to delete subscription', variant: 'destructive' });
     }
   };
 
   const getStatus = (endDate: string) => {
     return new Date(endDate) >= new Date() ? 'Active' : 'Expired';
   };
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold text-foreground">All Subscriptions</h1>
           <p className="text-muted-foreground mt-1">
             View and manage customer policy subscriptions
           </p>
         </div>
 
         <Card>
           <CardHeader>
             <CardTitle>Policy Subscriptions</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
             ) : subscriptions.length > 0 ? (
               <>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>ID</TableHead>
                       <TableHead>Plan</TableHead>
                       <TableHead>Customer</TableHead>
                       <TableHead>Start Date</TableHead>
                       <TableHead>End Date</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {subscriptions.map((sub) => {
                       const status = getStatus(sub.end_date);
                       return (
                         <TableRow key={sub.id}>
                           <TableCell className="font-mono text-sm">{sub.id}</TableCell>
                           <TableCell className="font-medium">
                             {sub.insurance_plan_name || `Plan #${sub.insurance_plan}`}
                           </TableCell>
                           <TableCell className="text-muted-foreground">
                             {sub.user_email || `User #${sub.user}`}
                           </TableCell>
                           <TableCell>
                             {format(new Date(sub.start_date), 'MMM d, yyyy')}
                           </TableCell>
                           <TableCell>
                             {format(new Date(sub.end_date), 'MMM d, yyyy')}
                           </TableCell>
                           <TableCell>
                             <span
                               className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 status === 'Active'
                                   ? 'bg-success/20 text-success'
                                   : 'bg-muted text-muted-foreground'
                               }`}
                             >
                               {status}
                             </span>
                           </TableCell>
                           <TableCell className="text-right">
                             <Button
                               variant="ghost"
                               size="icon"
                               onClick={() => handleDelete(sub.id)}
                             >
                               <Trash2 className="w-4 h-4 text-destructive" />
                             </Button>
                           </TableCell>
                         </TableRow>
                       );
                     })}
                   </TableBody>
                 </Table>
 
                 {totalPages > 1 && (
                   <div className="flex items-center justify-center gap-2 mt-6">
                     <Button
                       variant="outline"
                       size="icon"
                       disabled={page <= 1}
                       onClick={() => setPage(page - 1)}
                     >
                       <ChevronLeft className="w-4 h-4" />
                     </Button>
                     <span className="px-4 py-2 text-sm">
                       Page {page} of {totalPages}
                     </span>
                     <Button
                       variant="outline"
                       size="icon"
                       disabled={page >= totalPages}
                       onClick={() => setPage(page + 1)}
                     >
                       <ChevronRight className="w-4 h-4" />
                     </Button>
                   </div>
                 )}
               </>
             ) : (
               <div className="text-center py-12">
                 <p className="text-muted-foreground">No subscriptions found</p>
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </AdminLayout>
   );
}