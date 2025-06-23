import { User } from "../../components/utils/User";
import { sendPageTransitionEventData } from "../service/eventService";
import { PageTransitionEvent, BackendPageTransitionEvent } from "../types/Event";
import { PAGE_TRANSITION_EVENT_TYPE } from "../utils/constants";
import { getPageNameWithoutUrlIdentifiers } from "./utils";

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
let currentPagePath: string = getPageNameWithoutUrlIdentifiers(window.location.pathname);

// Track page transitions
const handlePageChange = (user: User | null, nextPagePath: string) => {

    if (!user) return;
    if (nextPagePath === currentPagePath) return;

    const endTimestamp: number = Date.now();
    const timeSpent: number | undefined = startTimestamp ? (endTimestamp - startTimestamp) : undefined;

    if (timeSpent === 0 || currentPagePath === nextPagePath) return; // filter redirect from page to the same page and autoredirects with time equal to 0 ms

    const pageTransitionEventEvent: PageTransitionEvent = getPageTransitionEventData(timeSpent, currentPagePath, nextPagePath)
    const requestBody: BackendPageTransitionEvent = mapPageTransitionEventToBackendRequestBody(pageTransitionEventEvent);
    sendPageTransitionEventData(user, requestBody);

    // Update tracking details for the new page
    startTimestamp = Date.now();
    currentPagePath = nextPagePath;
};

const handleNavigation = (user: User | null, url: string) => {
    handlePageChange(user, url);
};

// Start tracking
export const startTracking = (user: User | null) => {
    startTimestamp = Date.now();
    currentPagePath = getPageNameWithoutUrlIdentifiers(window.location.pathname);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        handleNavigation(user, getPageNameWithoutUrlIdentifiers(args[2] as string));
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        handleNavigation(user, getPageNameWithoutUrlIdentifiers(args[2] as string));
    };

    window.addEventListener("popstate", function (event) {
        handleNavigation(user, getPageNameWithoutUrlIdentifiers(document.location.pathname));
    });

    return () => {
        window.removeEventListener("popstate", function (event) {
            handleNavigation(user, getPageNameWithoutUrlIdentifiers(document.location.pathname));
        });
    };
};

// Stop tracking
export const stopTracking = () => {
    window.removeEventListener("popstate", () => {});
};
