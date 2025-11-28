/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
    "./libs/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores personalizados de Habitta (solo violetas y azules)
        violet: '#531A99', // Color principal original de Habitta
        'deep-violet': '#320964',
        'lavender-indigo': '#A346E6',
        'lavender-bright': '#BD93EF',
        'erie-black': '#1F1F1F',
        'white-traffic': '#F6F6F6',
        
        // Sistema de colores básico usando solo la paleta de Habitta
        background: '#FEFFFE',
        foreground: '#1F1F1F', // erie-black
        primary: '#531a99', // violet principal original
        secondary: '#A346E6', // lavender-indigo
        accent: '#BD93EF', // lavender-bright
      },
      borderRadius: {
        'sm': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
      },
      fontFamily: {
        'nunito': ['Nunito_400Regular'],
        'nunito-medium': ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
       //Alias para usar con tailwind
        'sans': ['Nunito_400Regular'],
        'medium': ['Nunito_500Medium'],
        'semibold': ['Nunito_600SemiBold'],
        'bold': ['Nunito_700Bold'],
      }
    },
  },
  plugins: [],
}

