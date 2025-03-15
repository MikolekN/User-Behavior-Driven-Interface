import { User } from "../../components/utils/User";
import { sendClickEventData } from "../service/sendClickEventService";
import { BackendClickEvent, ClickEvent } from "../types/Event";
import { ALL_QUICK_ICONS_ELEMENTS, CLICK_EVENT_TYPE, DROPDOWN } from "./constants";


const getClickEventData = (user: User, elementId: string): ClickEvent => {
	return {
		userId: user.id,
		startTimestamp: Date.now(),
		eventType: CLICK_EVENT_TYPE,
		pageUrl: window.location.href,
		token: "add me",
		elementId: elementId,
		fromDropdown: elementId.includes(DROPDOWN) ? true : false
	}
};

const getClickEventRequestBody = (event: ClickEvent): BackendClickEvent => {
	return {
		user_id: event.userId,
		start_timestamp: event.startTimestamp,
		event_type: event.eventType,
		page_url: event.pageUrl,
		token: event.token,
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
			const clickEvent: ClickEvent = getClickEventData(user, parentId)
			const requestBody: BackendClickEvent = getClickEventRequestBody(clickEvent);
			sendClickEventData(requestBody);
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
