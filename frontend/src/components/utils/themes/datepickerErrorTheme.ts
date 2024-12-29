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
                },
            },
        },
        views: {
            days: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                    },
                },
            },
            months: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                    },
                },
            },
            years: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                    },
                },
            },
            decades: {
                items: {
                    item: {
                        selected: "bg-blue-700 text-white hover:bg-blue-600",
                    },
                },
            },
        },
    }
};
