import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["selector", "class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'color-white': '#dedede',
  			'color-almond': '#e0d0a0',
  			'color-tan': '#c0a777',
  			'color-gold': '#f0b022',
  			'color-green': '#50b010',
  			'color-red': '#f62800',
  			'color-blue': '#33aad0',
  			'perk-green': '#22cc00',
  			'perk-blue': '#1166dd',
  			'perk-purple': '#8833cc',
  			'perk-orange': '#dd7700',
  			'decoration-green': '#44dd55',
  			'decoration-blue': '#6099f0',
  			'decoration-yellow': '#ccdd44',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
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
  plugins: [require("tailwindcss-animate")],
};
export default config;
