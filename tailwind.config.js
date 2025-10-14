/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#131313",
        emerald: '#006F52',
        lightEmerald: "#2AB38E",
        swamp: '#05231B',
        gray: '#767676',
        darkGray: '#9A9A9A',
        mediumGray: "#A9A9A9",
        grayForStats: "#696F6D",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        }

      },
      fontFamily: {
        pText: ["Righteous-Regular", "sans-serif"],
        pBlack: ["Roboto-Black", "sans-serif"],
        pBold: ["Roboto-Bold", "sans-serif"],
        pItalic: ["Roboto-Italic", "sans-serif"],
        pMedium: ["Roboto-Medium", "sans-serif"],
        pRegular: ["Roboto-Regular", "sans-serif"],
        pThin: ["Roboto-Thin", "sans-serif"]
      },
      spacing: {
        px: '1px',
        0: '0px',
        0.2: '2px',
        0.5: '5px',   // 0.5 * 10px
        0.8: '8px',   // 0.8 * 10px = 8px
        1: '10px',    // 1 * 10px
        1.2: '12px',  // 1.2 * 10px = 12px
        1.5: '15px',
        1.6: '16px',
        1.8: '18px',
        2: '20px',
        2.4: '24px',
        2.5: '25px',  // 2.5 * 10px
        3: '30px',    // 3 * 10px
        3.5: '35px',  // 3.5 * 10px
        4: '40px',    // 4 * 10px
        5: '50px',    // 5 * 10px
        6: '60px',    // 6 * 10px
        7: '70px',    // 7 * 10px
        8: '80px',    // 8 * 10px
        9: '90px',    // 9 * 10px
        10: '100px',  // 10 * 10px
        11: '110px',  // 11 * 10px
        12: '120px',  // 12 * 10px
        14: '140px',  // 14 * 10px
        16: '160px',  // 16 * 10px
        20: '200px',  // 20 * 10px
        24: '240px',  // 24 * 10px
        28: '280px',  // 28 * 10px
        32: '320px',  // 32 * 10px
        36: '360px',  // 36 * 10px
        40: '400px',  // 40 * 10px
        44: '440px',  // 44 * 10px
        48: '480px',  // 48 * 10px
        52: '520px',  // 52 * 10px
        56: '560px',  // 56 * 10px
        60: '600px',  // 60 * 10px
        64: '640px',  // 64 * 10px
        72: '720px',  // 72 * 10px
        80: '800px',  // 80 * 10px
        96: '960px',  // 96 * 10px
      },
      // Override font sizes to match your 10px scale
      fontSize: {
        xs: '10px',    // Your base size
        sm: '12px',
        base: '14px',  // Slightly larger than xs
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
        '5xl': '36px',
        '6xl': '48px',
        '7xl': '60px',
        '8xl': '72px',
        '9xl': '96px',
      },
    },
  },
  plugins: [],
};