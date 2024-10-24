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

			//stormforged red
			'perk-stormforged': '#a30825',

			//yoinked from wiki not sure if useful
			  'ats-default': '#dedede',
			  'ats-dark': '#0e0f0a',
			  'ats-yellow': '#e1aa46',
			  'ats-gold': '#a79372',
			  'ats-bright-gold': '#e2cd9d',
			  'ats-brown': '#59482d',
			  'ats-dark-brown': '#302513',
			  'ats-dark-brown-alt': '#261d0f',
			  'ats-green': '#53b522',
			  'ats-dark-green': '#0e1b0d',
			  'ats-dark-green-alt': '#122411',
			  'ats-blue': '#31b7fa',
			  'ats-bright-blue': '#92d8fc',
			  'ats-bright-blue-highlight': '#b4e5fd',
			  'ats-bright-blue-brighest': '#e1f5fe',
			  'ats-bright-blue-dim': '#79d0fc',
			  'ats-bright-green': '#87cb64',
			  'ats-bright-green-highlight': '#bae1a7',
			  'ats-bright-green-dim': '#53B522',
			  'ats-bright-red': '#f02a00',
			  'ats-color-tan-headings-text': '#c0a777',
			  'ats-color-gold-names-text': '#f0b022',
			  'ats-color-tan-widget-expand': '#8F7B5C',
			  'ats-color-brown-wood-bright': '#B0A880',
			  'ats-color-brown-wood-light': '#807755',
			  'ats-color-brown-wood-medium': '#66553B',
			  'ats-color-brown-wood-dark': '#2A261F',
			  'ats-color-brown-wood-shadow': '#211E19',
			  'ats-color-red-penalty-text': '#f62800',
			  'ats-color-red-effect-brilliant': '#fe4520',
			  'ats-color-red-warehouse': '#be2b20',
			  'ats-color-red-button': '#77311A',
			  'ats-color-red-effect-dark': '#2C0000',
			  'ats-color-red-toolbar': '#884033',
			  'ats-color-red-card-glow': '#521e25',
			  'ats-color-red-news-banner': '#351515',
			  'ats-color-red-card-dark': '#331f23',
			  'ats-color-blue-unfilled-resolve': '#0B1520',
			  'ats-color-green-leather-shadow': '#17170D',
			  'ats-color-green-leather-shadow-lighter': '#1C1C10',
	  
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
