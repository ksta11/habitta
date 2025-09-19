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
        // Colores personalizados de Habitta
        violet: '#7C3AED',
        'deep-violet': '#320964',
        'lavender-indigo': '#A346E6',
        'lavender-bright': '#BD93EF',
        'erie-black': '#1F1F1F',
        'white-traffic': '#F6F6F6',
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

