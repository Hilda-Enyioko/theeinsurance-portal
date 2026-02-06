 import { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { plansApi, categoriesApi } from '@/lib/api';
 import { InsurancePlan, PropertyCategory, PaginatedResponse } from '@/types';
 import { Search, Filter, Clock, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
 
 export default function Plans() {
   const [plans, setPlans] = useState<InsurancePlan[]>([]);
   const [categories, setCategories] = useState<PropertyCategory[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [categoryFilter, setCategoryFilter] = useState<string>('');
   const [sortBy, setSortBy] = useState<string>('');
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const pageSize = 9;
 
   useEffect(() => {
     const fetchCategories = async () => {
       try {
         const res = await categoriesApi.getAll();
         setCategories(res.data.results || res.data || []);
       } catch (error) {
         console.error('Failed to fetch categories:', error);
       }
     };
     fetchCategories();
   }, []);
 
   useEffect(() => {
     const fetchPlans = async () => {
       setIsLoading(true);
       try {
         const params: Record<string, string | number> = {
           page,
           page_size: pageSize,
         };
         if (categoryFilter) params.property_category = categoryFilter;
         if (sortBy) params.ordering = sortBy;
         if (search) params.search = search;
 
         const res = await plansApi.getAll(params);
         const data = res.data as PaginatedResponse<InsurancePlan>;
         setPlans(data.results || []);
         setTotalPages(Math.ceil((data.count || 0) / pageSize));
       } catch (error) {
         console.error('Failed to fetch plans:', error);
       } finally {
         setIsLoading(false);
       }
     };
     fetchPlans();
   }, [page, categoryFilter, sortBy, search]);
 
   const handleSearch = (e: React.FormEvent) => {
     e.preventDefault();
     setPage(1);
   };
 
   return (
     <MainLayout>
       <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="mb-8 animate-fade-in">
           <h1 className="text-3xl font-bold text-foreground mb-2">Insurance Plans</h1>
           <p className="text-muted-foreground">
             Find the perfect coverage for your needs from our comprehensive selection.
           </p>
         </div>
 
         {/* Filters */}
         <div className="flex flex-col md:flex-row gap-4 mb-8">
           <form onSubmit={handleSearch} className="flex-1">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 placeholder="Search plans..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-10"
               />
             </div>
           </form>
 
           <div className="flex gap-4">
             <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setPage(1); }}>
               <SelectTrigger className="w-48">
                 <Filter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="All Categories" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Categories</SelectItem>
                 {categories.map((cat) => (
                   <SelectItem key={cat.id} value={String(cat.id)}>
                     {cat.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
 
             <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
               <SelectTrigger className="w-40">
                 <SelectValue placeholder="Sort by" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">Default</SelectItem>
                 <SelectItem value="price">Price: Low to High</SelectItem>
                 <SelectItem value="-price">Price: High to Low</SelectItem>
                 <SelectItem value="duration_months">Duration: Short</SelectItem>
                 <SelectItem value="-duration_months">Duration: Long</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
 
         {/* Plans Grid */}
         {isLoading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
         ) : plans.length > 0 ? (
           <>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               {plans.map((plan, index) => (
                 <Card 
                   key={plan.id} 
                   className="group hover:shadow-brand-lg transition-all duration-300 animate-slide-up"
                   style={{ animationDelay: `${index * 50}ms` }}
                 >
                   <CardHeader>
                     <div className="flex items-start justify-between">
                       <div>
                         <CardTitle className="text-xl group-hover:text-primary transition-colors">
                           {plan.name}
                         </CardTitle>
                         <CardDescription>
                           {plan.property_category_name || 'Insurance Plan'}
                         </CardDescription>
                       </div>
                       <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                         ${plan.price}
                       </span>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                       {plan.description || 'Comprehensive insurance coverage for your peace of mind.'}
                     </p>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       <span>{plan.duration_months} months coverage</span>
                     </div>
                   </CardContent>
                   <CardFooter>
                     <Link to={`/plans/${plan.id}`} className="w-full">
                       <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                         View Details
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </Link>
                   </CardFooter>
                 </Card>
               ))}
             </div>
 
             {/* Pagination */}
             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-2">
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
           <div className="text-center py-20">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold text-foreground mb-2">No plans found</h3>
             <p className="text-muted-foreground mb-4">
               Try adjusting your search or filters to find what you're looking for.
             </p>
             <Button
               variant="outline"
               onClick={() => {
                 setSearch('');
                 setCategoryFilter('');
                 setSortBy('');
               }}
             >
               Clear Filters
             </Button>
           </div>
         )}
       </div>
     </MainLayout>
   );
 }