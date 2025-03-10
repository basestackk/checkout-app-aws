import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import UserAuthForm from './user-auth-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex items-center justify-center'>
  <div className='absolute inset-0 bg-zinc-900' />
  
  {/* Title section */}
  <div className='relative z-20 flex items-center text-lg font-medium text-center'>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='mr-2 h-6 w-6'
  >
    <circle cx='9' cy='21' r='1' />
    <circle cx='20' cy='21' r='1' />
    <path d='M1 1h4l2.2 10.4a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L23 6H6' />
  </svg>
  Checkout application with AWS
</div>



  {/* Quote section */}
  <div className='relative z-20 mt-10 text-center'>
    <blockquote className='space-y-2 max-w-md'>
      <p className='text-lg'>
        &ldquo;This project demonstrates an event-driven microservices architecture on AWS built with Next.js, ShadCN & Tailwind.&rdquo;
      </p>
      <footer className='text-sm'></footer>
    </blockquote>
  </div>
</div>

      
      {/* Centered Content */}
      <div className='flex h-full flex-col items-center justify-center space-y-6 p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Welcome!</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email below to login to your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
