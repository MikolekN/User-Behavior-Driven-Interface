import { User } from "../../components/utils/User";
import { sendHoverEventData } from "../service/eventService";
import { BackendHoverEvent, HoverEvent } from "../types/Event";
import { MAIN_MENU_ELEMENTS, ElementInfo, HOVER_EVENT_TYPE } from "../utils/constants";


const getHoverEventData = (elementId: string, duration: number | undefined): HoverEvent => {
    return {
        duration: duration ?? 0,
        elementId: elementId,
        eventType: HOVER_EVENT_TYPE,
        startTimestamp: new Date(),
        endTimestamp: new Date(),
        page: window.location.pathname
    };
};

const mapHoverEventToBackendHoverEvent = (event: HoverEvent): BackendHoverEvent => {
    return {
        duration: event.duration,
        element_id: event.elementId,
        event_type: event.eventType,
        start_timestamp: event.startTimestamp,
        end_timestamp: event.endTimestamp,
        page: event.page
    };
};

let startTimestamp: number | null = null;

const handleMainMenuLeaveHover = (event: Event, user: User | null, elements: ElementInfo[]) => {
    const target = event.target as HTMLElement;
    // Find the closest parent element that has an id and matches the specified elements
    const parentId = target.closest('[id]')?.id;
    
    if (!user) return;
    if (!target) return;
    if (!parentId) return;

    const endTimestamp: number = Date.now();
    const timeSpent: number | undefined = startTimestamp ? (endTimestamp - startTimestamp) : undefined;
    
    if (elements.some(element => element.id === parentId)) {
        const hoverEvent: HoverEvent = getHoverEventData(parentId, timeSpent)
        const requestBody: BackendHoverEvent = mapHoverEventToBackendHoverEvent(hoverEvent);
        sendHoverEventData(user, requestBody);
    } else {
        // console.log('Unknown element hovered');
    }
};

const handleMainMenuEnterHover = () => {
    startTimestamp = Date.now();
};

export const setupMainMenuHoverEvents = (user: User | null) => {
    // Event handler with dynamic action lookup
    const elements: ElementInfo[] = MAIN_MENU_ELEMENTS;
    
    const listeners: (() => void)[] = [];

    elements.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return;

        const mouseEnterHandler = (event: Event) => {
            handleMainMenuEnterHover();
        };
        const mouseLeaveHandler = (event: Event) => {
            handleMainMenuLeaveHover(event, user, elements);
        };

        element.addEventListener('mouseenter', mouseEnterHandler);
        element.addEventListener('mouseleave', mouseLeaveHandler);

        // Save cleanup function for each element
        listeners.push(() => {
            element.removeEventListener('mouseenter', mouseEnterHandler);
            element.removeEventListener('mouseleave', mouseLeaveHandler);
        });
    });

    // Cleanup function to remove all listeners
    return () => {
        listeners.forEach((removeListener) => removeListener());
    };
};

