import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { plansApi, categoriesApi } from '@/lib/api';
import { InsurancePlan, PropertyCategory, PaginatedResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
 
export default function AdminPlans() {
   const { toast } = useToast();
   const [plans, setPlans] = useState<InsurancePlan[]>([]);
   const [categories, setCategories] = useState<PropertyCategory[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingPlan, setEditingPlan] = useState<InsurancePlan | null>(null);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const pageSize = 10;
 
   const [formData, setFormData] = useState({
     name: '',
     description: '',
     price: '',
     duration_months: '6',
     property_category: '',
   });
 
   const fetchPlans = async () => {
     setIsLoading(true);
     try {
       const res = await plansApi.getAll({ page, page_size: pageSize });
       const data = res.data as PaginatedResponse<InsurancePlan>;
       setPlans(data.results || []);
       setTotalPages(Math.ceil((data.count || 0) / pageSize));
     } catch (error) {
       console.error('Failed to fetch plans:', error);
     } finally {
       setIsLoading(false);
     }
   };
 
   const fetchCategories = async () => {
     try {
       const res = await categoriesApi.getAll();
       setCategories(res.data.results || res.data || []);
     } catch (error) {
       console.error('Failed to fetch categories:', error);
     }
   };
 
   useEffect(() => {
     fetchCategories();
   }, []);
 
   useEffect(() => {
     fetchPlans();
   }, [page]);
 
   const openCreateDialog = () => {
     setEditingPlan(null);
     setFormData({
       name: '',
       description: '',
       price: '',
       duration_months: '6',
       property_category: '',
     });
     setDialogOpen(true);
   };
 
   const openEditDialog = (plan: InsurancePlan) => {
     setEditingPlan(plan);
     setFormData({
       name: plan.name,
       description: plan.description || '',
       price: String(plan.price),
       duration_months: String(plan.duration_months),
       property_category: String(plan.property_category),
     });
     setDialogOpen(true);
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!formData.name.trim() || !formData.price || !formData.property_category) {
       toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
       return;
     }
 
     setIsSubmitting(true);
     try {
       const payload = {
         name: formData.name,
         description: formData.description,
         price: parseFloat(formData.price),
         duration_months: parseInt(formData.duration_months),
         property_category: parseInt(formData.property_category),
       };
 
       if (editingPlan) {
         await plansApi.update(editingPlan.id, payload);
         toast({ title: 'Success', description: 'Plan updated successfully' });
       } else {
         await plansApi.create(payload);
         toast({ title: 'Success', description: 'Plan created successfully' });
       }
       setDialogOpen(false);
       fetchPlans();
     } catch (error) {
       console.error('Failed to save plan:', error);
       toast({ title: 'Error', description: 'Failed to save plan', variant: 'destructive' });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handleDelete = async (id: number) => {
     if (!confirm('Are you sure you want to delete this plan?')) return;
     
     try {
       await plansApi.delete(id);
       toast({ title: 'Success', description: 'Plan deleted successfully' });
       fetchPlans();
     } catch (error) {
       console.error('Failed to delete plan:', error);
       toast({ title: 'Error', description: 'Failed to delete plan', variant: 'destructive' });
     }
   };
 
   const durationOptions = [6, 12, 18, 24, 30, 36];
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold text-foreground">Insurance Plans</h1>
             <p className="text-muted-foreground mt-1">
               Manage your insurance plan offerings
             </p>
           </div>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
             <DialogTrigger asChild>
               <Button onClick={openCreateDialog}>
                 <Plus className="w-4 h-4 mr-2" />
                 Add Plan
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-md">
               <form onSubmit={handleSubmit}>
                 <DialogHeader>
                   <DialogTitle>
                     {editingPlan ? 'Edit Plan' : 'Create Plan'}
                   </DialogTitle>
                   <DialogDescription>
                     {editingPlan 
                       ? 'Update the insurance plan details'
                       : 'Add a new insurance plan for customers'}
                   </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="name">Name *</Label>
                     <Input
                       id="name"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       placeholder="e.g., Premium Home Insurance"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="category">Category *</Label>
                     <Select
                       value={formData.property_category}
                       onValueChange={(val) => setFormData({ ...formData, property_category: val })}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                       <SelectContent>
                         {categories.map((cat) => (
                           <SelectItem key={cat.id} value={String(cat.id)}>
                             {cat.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="price">Price ($) *</Label>
                       <Input
                         id="price"
                         type="number"
                         min="0"
                         step="0.01"
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                         placeholder="99.99"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="duration">Duration *</Label>
                       <Select
                         value={formData.duration_months}
                         onValueChange={(val) => setFormData({ ...formData, duration_months: val })}
                       >
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {durationOptions.map((months) => (
                             <SelectItem key={months} value={String(months)}>
                               {months} months
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                       id="description"
                       value={formData.description}
                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       placeholder="Plan description..."
                       rows={3}
                     />
                   </div>
                 </div>
                 <DialogFooter>
                   <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                     Cancel
                   </Button>
                   <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                     {editingPlan ? 'Update' : 'Create'}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
         </div>
 
         <Card>
           <CardHeader>
             <CardTitle>All Plans</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
             ) : plans.length > 0 ? (
               <>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>ID</TableHead>
                       <TableHead>Name</TableHead>
                       <TableHead>Category</TableHead>
                       <TableHead>Duration</TableHead>
                       <TableHead>Price</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {plans.map((plan) => (
                       <TableRow key={plan.id}>
                         <TableCell className="font-mono text-sm">{plan.id}</TableCell>
                         <TableCell className="font-medium">{plan.name}</TableCell>
                         <TableCell className="text-muted-foreground">
                           {plan.property_category_name || `#${plan.property_category}`}
                         </TableCell>
                         <TableCell>{plan.duration_months} months</TableCell>
                         <TableCell className="font-medium">${plan.price}</TableCell>
                         <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                             <Button
                               variant="ghost"
                               size="icon"
                               onClick={() => openEditDialog(plan)}
                             >
                               <Pencil className="w-4 h-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="icon"
                               onClick={() => handleDelete(plan.id)}
                             >
                               <Trash2 className="w-4 h-4 text-destructive" />
                             </Button>
                           </div>
                         </TableCell>
                       </TableRow>
                     ))}
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
                 <p className="text-muted-foreground mb-4">No plans found</p>
                 <Button onClick={openCreateDialog}>
                   <Plus className="w-4 h-4 mr-2" />
                   Create First Plan
                 </Button>
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </AdminLayout>
   );
}