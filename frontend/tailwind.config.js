const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        flowbite.content(),
    ],
    theme: {
        extend: {},
        screens: {
            sm: '640px',
            md: '1024px',
            lg: '1280px',
            xl: '1536px',
        },
    },
    plugins: [
        flowbite.plugin(),
    ],
}
