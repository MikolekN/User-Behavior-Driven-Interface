import { User } from "../../components/utils/User";
import { sendPageTransitionEventData } from "../service/eventService";
import { PageTransitionEvent, BackendPageTransitionEvent } from "../types/Event";
import { PAGE_TRANSITION_EVENT_TYPE } from "./constants";

const getPageTransitionEventData = (timeSpent: number | undefined, currentPagePath: string, nextPagePath: string): PageTransitionEvent => {
    return {
        startTimestamp: new Date(),
        eventType: PAGE_TRANSITION_EVENT_TYPE,
        page: currentPagePath,
        timeSpent: timeSpent ?? 0,
        nextPage: nextPagePath
    }
};

const mapPageTransitionEventToBackendRequestBody = (event: PageTransitionEvent): BackendPageTransitionEvent => {
    return {
        start_timestamp: event.startTimestamp,
        event_type: event.eventType,
        page: event.page,
        time_spent: event.timeSpent,
        next_page: event.nextPage
    }
};

let startTimestamp: number | null = null;
let currentPagePath: string = window.location.pathname;

// Track page transitions
const handlePageChange = (user: User, nextPagePath: string) => {
    const endTimestamp: number = Date.now();
    const timeSpent: number | undefined = startTimestamp ? (endTimestamp - startTimestamp) / 1000 : undefined;

    const pageTransitionEventEvent: PageTransitionEvent = getPageTransitionEventData(timeSpent, currentPagePath, nextPagePath)
    const requestBody: BackendPageTransitionEvent = mapPageTransitionEventToBackendRequestBody(pageTransitionEventEvent);
    sendPageTransitionEventData(user, requestBody);

    // Update tracking details for the new page
    startTimestamp = Date.now();
    currentPagePath = nextPagePath;
};

// Override browser navigation functions
const overrideHistoryMethods = (user: User) => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const handleNavigation = (url: string) => {
        if (url !== currentPagePath) {
            setTimeout(() => handlePageChange(user, url), 0);
        }
    };

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        handleNavigation(args[2] as string);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        handleNavigation(args[2] as string);
    };

    window.addEventListener("popstate", (event) => {
        handleNavigation(document.location.pathname);
    });
};

// Start tracking
export const startTracking = (user: User) => {
    if (!user) {
        console.warn("User not found, tracking not started.");
        return;
    }

    startTimestamp = Date.now();
    currentPagePath = window.location.pathname;

    overrideHistoryMethods(user);
};

// Stop tracking
export const stopTracking = () => {
    window.removeEventListener("popstate", () => {});
};
