import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { categoriesApi } from '@/lib/api';
import { PropertyCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
 
 export default function Categories() {
   const { toast } = useToast();
   const [categories, setCategories] = useState<PropertyCategory[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingCategory, setEditingCategory] = useState<PropertyCategory | null>(null);
   const [formData, setFormData] = useState({ name: '', description: '' });
 
   const fetchCategories = async () => {
     try {
       const res = await categoriesApi.getAll();
       setCategories(res.data.results || res.data || []);
     } catch (error) {
       console.error('Failed to fetch categories:', error);
     } finally {
       setIsLoading(false);
     }
   };
 
   useEffect(() => {
     fetchCategories();
   }, []);
 
   const openCreateDialog = () => {
     setEditingCategory(null);
     setFormData({ name: '', description: '' });
     setDialogOpen(true);
   };
 
   const openEditDialog = (category: PropertyCategory) => {
     setEditingCategory(category);
     setFormData({ name: category.name, description: category.description || '' });
     setDialogOpen(true);
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!formData.name.trim()) {
       toast({ title: 'Error', description: 'Name is required', variant: 'destructive' });
       return;
     }
 
     setIsSubmitting(true);
     try {
       if (editingCategory) {
         await categoriesApi.update(editingCategory.id, formData);
         toast({ title: 'Success', description: 'Category updated successfully' });
       } else {
         await categoriesApi.create(formData);
         toast({ title: 'Success', description: 'Category created successfully' });
       }
       setDialogOpen(false);
       fetchCategories();
     } catch (error) {
       console.error('Failed to save category:', error);
       toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handleDelete = async (id: number) => {
     if (!confirm('Are you sure you want to delete this category?')) return;
     
     try {
       await categoriesApi.delete(id);
       toast({ title: 'Success', description: 'Category deleted successfully' });
       fetchCategories();
     } catch (error) {
       console.error('Failed to delete category:', error);
       toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
     }
   };
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold text-foreground">Property Categories</h1>
             <p className="text-muted-foreground mt-1">
               Manage insurance property categories
             </p>
           </div>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
             <DialogTrigger asChild>
               <Button onClick={openCreateDialog}>
                 <Plus className="w-4 h-4 mr-2" />
                 Add Category
               </Button>
             </DialogTrigger>
             <DialogContent>
               <form onSubmit={handleSubmit}>
                 <DialogHeader>
                   <DialogTitle>
                     {editingCategory ? 'Edit Category' : 'Create Category'}
                   </DialogTitle>
                   <DialogDescription>
                     {editingCategory 
                       ? 'Update the category details below'
                       : 'Add a new property category for insurance plans'}
                   </DialogDescription>
                 </DialogHeader>
                 <div className="space-y-4 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="name">Name</Label>
                     <Input
                       id="name"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       placeholder="e.g., Residential Property"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                       id="description"
                       value={formData.description}
                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                       placeholder="Brief description of this category"
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
                     {editingCategory ? 'Update' : 'Create'}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
         </div>
 
         <Card>
           <CardHeader>
             <CardTitle>All Categories</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <div className="flex items-center justify-center py-12">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
             ) : categories.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Name</TableHead>
                     <TableHead>Description</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {categories.map((category) => (
                     <TableRow key={category.id}>
                       <TableCell className="font-mono text-sm">{category.id}</TableCell>
                       <TableCell className="font-medium">{category.name}</TableCell>
                       <TableCell className="text-muted-foreground max-w-xs truncate">
                         {category.description || '-'}
                       </TableCell>
                       <TableCell className="text-right">
                         <div className="flex items-center justify-end gap-2">
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => openEditDialog(category)}
                           >
                             <Pencil className="w-4 h-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => handleDelete(category.id)}
                           >
                             <Trash2 className="w-4 h-4 text-destructive" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
               <div className="text-center py-12">
                 <p className="text-muted-foreground mb-4">No categories found</p>
                 <Button onClick={openCreateDialog}>
                   <Plus className="w-4 h-4 mr-2" />
                   Create First Category
                 </Button>
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </AdminLayout>
   );
}