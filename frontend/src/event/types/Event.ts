export interface BaseEvent {
    startTimestamp: Date;
    eventType: string;
    page: string;
};

export interface ClickEvent extends BaseEvent {
    elementId: string;
    fromDropdown: boolean;
};

export interface HoverEvent extends BaseEvent {
    elementId: string;
    endTimestamp: Date;
    duration: number;
};

export interface PageTransitionEvent extends BaseEvent {
    nextPage: string;
    timeSpent: number;
};

export interface FormSubmitEvent extends BaseEvent {
    elementId: string;
    fromDropdown: boolean;
};

export interface BackendBaseEvent {
    start_timestamp: Date;
    event_type: string;
    page: string;
};

export interface BackendClickEvent extends BackendBaseEvent {
    element_id: string;
    from_dropdown: boolean;
};

export interface BackendFormSubmitEvent extends BackendBaseEvent {
    element_id: string;
    from_dropdown: boolean;
};

export interface BackendHoverEvent extends BackendBaseEvent {
    element_id: string;
    end_timestamp: Date;
    duration: number;
};

export interface BackendPageTransitionEvent extends BackendBaseEvent {
    next_page: string;
    time_spent: number;
};

