import { User } from "../../components/utils/User";
import { sendClickEventData } from "../service/eventService";
import { BackendClickEvent, ClickEvent } from "../types/Event";
import { ALL_QUICK_ICONS_ELEMENTS, CLICK_EVENT_TYPE, DROPDOWN, ElementInfo } from "./constants";


const getClickEventData = (elementId: string): ClickEvent => {
	return {
		startTimestamp: new Date(),
		eventType: CLICK_EVENT_TYPE,
		page: window.location.href,
		elementId: elementId,
		fromDropdown: elementId.includes(DROPDOWN) ? true : false
	}
};

const mapClickEventToBackendRequestBody = (event: ClickEvent): BackendClickEvent => {
	return {
		start_timestamp: event.startTimestamp,
		event_type: event.eventType,
		page: event.page,
		element_id: event.elementId,
		from_dropdown: event.fromDropdown
	}
};

const handleMenuClick = (event: Event, user: User | null, elements: ElementInfo[]) => {
	const target = event.target as HTMLElement;
	// Find the closest parent element that has an id and matches the specified elements
	const parentId = target.closest('[id]')?.id;
	
	if (!user) return;
	if (!target) return;
	if (!parentId) return;
	
	if (elements.some(element => element.id === parentId)) {
		const clickEvent: ClickEvent = getClickEventData(parentId)
		const requestBody: BackendClickEvent = mapClickEventToBackendRequestBody(clickEvent);
		sendClickEventData(user, requestBody);
	} else {
		console.log('Unknown element clicked');
	}
};

export const setupUserDropdownClickEvents = (user: User | null) => {
    // Event handler with dynamic action lookup

	const elemnets: ElementInfo[] = ALL_QUICK_ICONS_ELEMENTS;
	// Add event listener to document.body
	const header = document.getElementById("layout-header");
	header?.addEventListener('click', function (event: Event) {
		handleMenuClick(event, user, elemnets);
	});

	// Cleanup function to remove event listener
	return () => {
		header?.removeEventListener('click', function (event: Event) {
			handleMenuClick(event, user, elemnets);
		});
	};
};
