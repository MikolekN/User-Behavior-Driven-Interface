import { CustomFlowbiteTheme } from "flowbite-react";

export const datepickerTheme: CustomFlowbiteTheme = {
    datepicker: {
        root: {
            base: "relative"
        },
        popup: {
            footer: {
                base: "mt-2 flex space-x-2",
                button: {
                    base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300",
                    // today wymusza ustawienie daty dzisiejszej a nasza logika to jest od jutra
                    today: "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700", 
                    // clear czyści datę i ustawia jej null ale dalej na froncie jest wyświetlona poprzednia data, mylące to jest i powoduje po submit error
                    // z odczytania nulla
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