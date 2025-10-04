import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			headline: [
  				'Space Grotesk',
  				'sans-serif'
  			],
  			code: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		colors: {
  			'space-navy': {
  				'50': '#E8EAFF',
  				'100': '#D1D6FF',
  				'200': '#A3ADFF',
  				'300': '#7584FF',
  				'400': '#475BFF',
  				'500': '#1E2A78',
  				'600': '#1A2466',
  				'700': '#151E54',
  				'800': '#111842',
  				'900': '#0C1230',
  				DEFAULT: '#1E2A78'
  			},
  			'earth-green': {
  				'50': '#E6F7F4',
  				'100': '#CDEFEA',
  				'200': '#9BDFD4',
  				'300': '#69CFBF',
  				'400': '#37BFAA',
  				'500': '#3FA796',
  				'600': '#338E82',
  				'700': '#27756E',
  				'800': '#1B5C5A',
  				'900': '#0F4346',
  				DEFAULT: '#3FA796'
  			},
  			'golden-sun': {
  				'50': '#FFF8E1',
  				'100': '#FFF1C4',
  				'200': '#FFE388',
  				'300': '#FFD54C',
  				'400': '#FFC710',
  				'500': '#FFB703',
  				'600': '#E09600',
  				'700': '#C07500',
  				'800': '#A15400',
  				'900': '#813300',
  				DEFAULT: '#FFB703'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
