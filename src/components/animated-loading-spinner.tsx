'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'white' | 'muted'
}

export default function AnimatedLoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary'
}: AnimatedLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white',
    muted: 'border-muted-foreground'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-solid border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Alternative pulsing dots spinner
export function PulsingDotsSpinner({ 
  className,
  color = 'primary'
}: { 
  className?: string
  color?: 'primary' | 'secondary' | 'white' | 'muted'
}) {
  const dotColorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white',
    muted: 'bg-muted-foreground'
  }

  return (
    <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
      <div className={cn('w-2 h-2 rounded-full animate-pulse', dotColorClasses[color])} style={{ animationDelay: '0ms' }} />
      <div className={cn('w-2 h-2 rounded-full animate-pulse', dotColorClasses[color])} style={{ animationDelay: '150ms' }} />
      <div className={cn('w-2 h-2 rounded-full animate-pulse', dotColorClasses[color])} style={{ animationDelay: '300ms' }} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Orbital spinner for more complex loading states
export function OrbitalSpinner({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div 
      className={cn('relative', sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin" 
             style={{ 
               animation: 'spin 1s linear infinite',
               transformOrigin: `0 ${sizeClasses[size] === 'w-8 h-8' ? '16px' : sizeClasses[size] === 'w-12 h-12' ? '24px' : '32px'}` 
             }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" 
             style={{ 
               animation: 'spin 1.5s linear infinite reverse',
               transformOrigin: `0 ${sizeClasses[size] === 'w-8 h-8' ? '16px' : sizeClasses[size] === 'w-12 h-12' ? '24px' : '32px'}` 
             }} />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}