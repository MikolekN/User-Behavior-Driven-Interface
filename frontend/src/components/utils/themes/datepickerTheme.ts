import { CustomFlowbiteTheme } from "flowbite-react";
import { textInputTheme } from "./textInputTheme";

export const datepickerTheme: CustomFlowbiteTheme = {
    datepicker: {
        root: {
            base: "relative",
            input: textInputTheme
        },
        popup: {
            footer: {
                button: {
                    base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
                },
            },
        },
        views: {
            days: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600 dark:bg-slate-900 dark:hover:bg-slate-800",
                    },
                },
            },
            months: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600 dark:bg-slate-900 dark:hover:bg-slate-800",
                    },
                },
            },
            years: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600 dark:bg-slate-900 dark:hover:bg-slate-800",
                    },
                },
            },
            decades: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600 dark:bg-slate-900 dark:hover:bg-slate-800",
                    },
                },
            },
        },
    }
};
