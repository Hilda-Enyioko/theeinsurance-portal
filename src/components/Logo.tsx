import { Shield } from 'lucide-react';
 
interface LogoProps {
   size?: 'sm' | 'md' | 'lg';
   showText?: boolean;
}
 
export function Logo({ size = 'md', showText = true }: LogoProps) {
   const sizeClasses = {
     sm: 'w-6 h-6',
     md: 'w-8 h-8',
     lg: 'w-12 h-12',
   };
 
   const textClasses = {
     sm: 'text-lg',
     md: 'text-xl',
     lg: 'text-2xl',
   };
 
   return (
     <div className="flex items-center gap-2">
       <div className="relative">
         <div className="gradient-primary rounded-lg p-1.5 shadow-brand-md">
           <Shield className={`${sizeClasses[size]} text-primary-foreground`} />
         </div>
       </div>
       {showText && (
         <span className={`${textClasses[size]} font-bold text-foreground`}>
           Thee<span className="text-primary">Insurance</span>
         </span>
       )}
     </div>
   );
}