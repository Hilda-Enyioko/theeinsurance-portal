 export interface User {
   id: number;
   email: string;
   first_name?: string;
   last_name?: string;
   is_staff?: boolean;
 }
 
 export interface AuthTokens {
   access: string;
   refresh: string;
 }
 
 export interface PropertyCategory {
   id: number;
   name: string;
   description?: string;
 }
 
 export interface InsurancePlan {
   id: number;
   name: string;
   price: number;
   duration_months: number;
   property_category: number;
   property_category_name?: string;
   description?: string;
 }
 
 export interface PolicySubscription {
   id: number;
   insurance_plan: number;
   insurance_plan_name?: string;
   start_date: string;
   end_date: string;
   user: number;
   user_email?: string;
 }
 
 export interface PaginatedResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
 }
 
 export type UserRole = 'customer' | 'admin';