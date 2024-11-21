import { CustomFlowbiteTheme } from "flowbite-react";
import { textInputErrorTheme } from "./textInputErrorTheme";

export const datepickerErrorTheme: CustomFlowbiteTheme = {
    datepicker: {
        root: {
            base: "relative",
            input: textInputErrorTheme
        },
        popup: {
            footer: {
                base: "mt-2 flex space-x-2",
                button: {
                    base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
                    today: "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700", 
                    clear: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                },
            },
        },
        views: {
            days: {
                items: {
                    base: "grid w-64 grid-cols-7",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                        disabled: "text-gray-500",
                    },
                },
            },
            months: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                        disabled: "text-gray-500",
                    },
                },
            },
            years: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                        disabled: "text-gray-500",
                    },
                },
            },
            decades: {
                items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                        base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                        disabled: "text-gray-500",
                    },
                },
            },
        },
    }
};
