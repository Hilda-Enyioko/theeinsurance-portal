 import { Link } from 'react-router-dom';
 import { MainLayout } from '@/components/layouts/MainLayout';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Shield, Home, Car, Heart, ArrowRight, CheckCircle2, Users, Clock, Award } from 'lucide-react';
 
 const features = [
   {
     icon: Shield,
     title: 'Comprehensive Coverage',
     description: 'Get complete protection for all your valuable assets with our tailored insurance plans.',
   },
   {
     icon: Clock,
     title: 'Quick Claims',
     description: 'Our streamlined process ensures your claims are processed quickly and efficiently.',
   },
   {
     icon: Users,
     title: 'Expert Support',
     description: '24/7 customer support from our team of experienced insurance professionals.',
   },
   {
     icon: Award,
     title: 'Trusted Provider',
     description: 'Join thousands of satisfied customers who trust us with their insurance needs.',
   },
 ];
 
 const categories = [
   {
     icon: Home,
     name: 'Property',
     description: 'Protect your home and belongings',
   },
   {
     icon: Car,
     name: 'Vehicle',
     description: 'Coverage for cars, bikes, and more',
   },
   {
     icon: Heart,
     name: 'Health',
     description: 'Comprehensive health protection',
   },
 ];
 
 const benefits = [
   'Flexible payment options',
   'No hidden fees or charges',
   'Easy online management',
   'Instant policy documents',
   'Competitive premiums',
   'Hassle-free renewals',
 ];
 
 export default function Landing() {
   return (
     <MainLayout>
       {/* Hero Section */}
       <section className="gradient-hero">
         <div className="container mx-auto px-4 py-20 lg:py-32">
           <div className="max-w-3xl mx-auto text-center animate-fade-in">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
               Protect What Matters Most with{' '}
               <span className="text-primary">TheeInsurance</span>
             </h1>
             <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
               Comprehensive insurance solutions designed to give you peace of mind. 
               Simple, transparent, and always there when you need us.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link to="/register">
                 <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                   Get Started
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
               </Link>
               <Link to="/plans">
                 <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                   View Plans
                 </Button>
               </Link>
             </div>
           </div>
         </div>
       </section>
 
       {/* Categories Section */}
       <section className="py-20 bg-card">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
               Insurance for Every Need
             </h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Choose from our wide range of insurance categories designed to protect 
               different aspects of your life.
             </p>
           </div>
           <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
             {categories.map((category, index) => (
               <Card 
                 key={category.name} 
                 className="group hover:shadow-brand-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 animate-slide-up"
                 style={{ "--animation-delay": `${index * 100}ms` } as React.CSSProperties}
               >
                 <CardHeader className="text-center">
                   <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <category.icon className="w-8 h-8 text-primary-foreground" />
                   </div>
                   <CardTitle className="text-xl">{category.name}</CardTitle>
                   <CardDescription>{category.description}</CardDescription>
                 </CardHeader>
               </Card>
             ))}
           </div>
         </div>
       </section>
 
       {/* Features Section */}
       <section className="py-20">
         <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
               Why Choose TheeInsurance?
             </h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               We're committed to providing the best insurance experience with features 
               that set us apart from the rest.
             </p>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {features.map((feature, index) => (
               <Card 
                 key={feature.title} 
                 className="text-center animate-slide-up"
                 style={{ "--animation-delay": `${index * 100}ms` } as React.CSSProperties}
               >
                 <CardHeader>
                   <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                     <feature.icon className="w-6 h-6 text-primary" />
                   </div>
                   <CardTitle className="text-lg">{feature.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground text-sm">{feature.description}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       </section>
 
       {/* Benefits Section */}
       <section className="py-20 bg-secondary">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                 Benefits of Our Platform
               </h2>
               <p className="text-muted-foreground">
                 Experience insurance the modern way with these exclusive benefits.
               </p>
             </div>
             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
               {benefits.map((benefit, index) => (
                 <div 
                   key={benefit} 
                   className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-brand-sm animate-scale-in"
                   style={{ "--animation-delay": `${index * 50}ms` } as React.CSSProperties}
                 >
                   <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                   <span className="text-foreground font-medium">{benefit}</span>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>
 
       {/* CTA Section */}
       <section className="py-20">
         <div className="container mx-auto px-4">
           <Card className="gradient-primary text-center py-12">
             <CardContent className="max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                 Ready to Get Protected?
               </h2>
               <p className="text-primary-foreground/90 mb-8">
                 Join thousands of customers who trust TheeInsurance for their protection needs. 
                 Start your journey to comprehensive coverage today.
               </p>
               <Link to="/register">
                 <Button 
                   size="lg" 
                   variant="secondary" 
                   className="text-lg px-8"
                 >
                   Create Free Account
                   <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
               </Link>
             </CardContent>
           </Card>
         </div>
       </section>
     </MainLayout>
   );
 }