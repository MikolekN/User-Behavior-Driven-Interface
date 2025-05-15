import { User } from "../../components/utils/User";
import { sendClickEventData } from "../service/eventService";
import { BackendClickEvent, ClickEvent } from "../types/Event";
import { ALL_QUICK_ICONS_ELEMENTS, CLICK_EVENT_TYPE, DROPDOWN, ElementInfo } from "../utils/constants";


const getClickEventData = (elementId: string, eventType: string): ClickEvent => {
	return {
		startTimestamp: new Date(),
		eventType: eventType,
		page: window.location.pathname,
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

export const triggerCustomFormSubmitEvent = (elementId: string) => {
	const layout = document.getElementById("layout-content-area");
	const successEvent = new CustomEvent('form-submit-success', {
		detail: {
			elementId: elementId
		}
		});
	layout?.dispatchEvent(successEvent);
};

const handleFormSubmitEvent = (event: Event, user: User | null) => {
	const target = event.target as HTMLElement;
	
	if (!user) return;
	if (!target) return;

	const customEvent = event as CustomEvent;
	const clickEvent: ClickEvent = getClickEventData(customEvent.detail?.elementId, CLICK_EVENT_TYPE);
	const requestBody: BackendClickEvent = mapClickEventToBackendRequestBody(clickEvent);
	sendClickEventData(user, requestBody);
};

const handleElementClickEvent = (event: Event, user: User | null, elements: ElementInfo[]) => {
	const target = event.target as HTMLElement;
	// Find the closest parent element that has an id and matches the specified elements
	const parentId = target.closest('[id]')?.id;

	if (!user) return;
	if (!target) return;
	if (!parentId) return;
	
	if (elements.some(element => element.id === parentId)) {
		const clickEvent: ClickEvent = getClickEventData(parentId, CLICK_EVENT_TYPE);
		const requestBody: BackendClickEvent = mapClickEventToBackendRequestBody(clickEvent);
		sendClickEventData(user, requestBody);
	} else {
		// console.log('Unknown element clicked');
	}
};

export const setupUserDropdownClickEvents = (user: User | null) => {
    // Event handler with dynamic action lookup
	const elements: ElementInfo[] = ALL_QUICK_ICONS_ELEMENTS;
	// Add event listener to document.body
	const header = document.getElementById("layout-header");
	header?.addEventListener('click', function (event: Event) {
		handleElementClickEvent(event, user, elements);
	});
	// Cleanup function to remove event listener
	return () => {
		header?.removeEventListener('click', function (event: Event) {
			handleElementClickEvent(event, user, elements);
		});
	};
};

export const setupFormSucessfulSubmitButtonsClickEvents = (user: User | null) => {
	const layout = document.getElementById("layout-content-area");
	layout?.addEventListener('form-submit-success', function (event: Event) {
		handleFormSubmitEvent(event, user);
	});
	// Cleanup function to remove event listener
	return () => {
		layout?.removeEventListener('form-submit-success', function (event: Event) {
			handleFormSubmitEvent(event, user);
		});
	};
}
