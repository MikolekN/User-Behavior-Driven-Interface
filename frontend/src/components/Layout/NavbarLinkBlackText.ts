import { FlowbiteNavbarLinkTheme } from "flowbite-react/components/Navbar";

export const blackTextTheme: FlowbiteNavbarLinkTheme = {
    base: "block py-2 pl-3 pr-4 md:p-0",
    active: {
        "on": "bg-black text-white dark:text-white md:bg-transparent md:text-black",
        "off": "border-b border-gray-100 text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-black md:dark:hover:bg-transparent md:dark:hover:text-white"
    },
    disabled: {
        "on": "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
        "off": ""
    }
};