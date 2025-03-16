import { User } from "../../components/utils/User";
import { sendClickEventData } from "../service/eventService";
import { BackendClickEvent, ClickEvent } from "../types/Event";
import { ALL_QUICK_ICONS_ELEMENTS, CLICK_EVENT_TYPE, DROPDOWN } from "./constants";


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

export const setupUserDropdownClickEvents = (user: User | null) => {
    // Event handler with dynamic action lookup
	const handleMenuClick = (event: Event) => {
		const target = event.target as HTMLElement;
		// Find the closest parent element that has an id and matches the specified elements
		const parentId = target.closest('[id]')?.id;
		
		if (!user) return;
		if (!target) return;
		if (!parentId) return;
		
		if (ALL_QUICK_ICONS_ELEMENTS.some(element => element.id === parentId)) {
			const clickEvent: ClickEvent = getClickEventData(parentId)
			const requestBody: BackendClickEvent = mapClickEventToBackendRequestBody(clickEvent);
			sendClickEventData(user, requestBody);
		} else {
			console.log('Unknown element clicked');
		}
	};

	// Add event listener to document.body
	const header = document.getElementById("layout-header");
	header?.addEventListener('click', handleMenuClick);

	// Cleanup function to remove event listener
	return () => {
		header?.removeEventListener('click', handleMenuClick);
	};
};
