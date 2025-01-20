/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"]
    },
    extend: {
      colors:{
        primary:"#303030",
        secondary:"#191a32"
      },
      backgroundImage:{
        'login-bg-img':"url(./src/assets/loginBg.png)",
        'signup-bg-img':"url(./src/assets/signupbg.png)",
      }
    },
  },
  plugins: [],
}
