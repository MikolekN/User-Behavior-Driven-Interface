export interface BaseEvent {
    userId: string;
    startTimestamp: number;
    eventType: string;
    pageUrl: string;
    token: string;
};

export interface ClickEvent extends BaseEvent {
    elementId: string;
    fromDropdown: boolean;
};

export interface HoverEvent extends BaseEvent {
    elementId: string;
    endTimestamp: number;
    duration: number;
};

export interface PageTransitionEvent extends BaseEvent {
    nextPageUrl: string;
    timeSpent: number;
};

export interface BackendBaseEvent {
    user_id: string;
    start_timestamp: number;
    event_type: string;
    page_url: string;
    token: string;
};

export interface BackendClickEvent extends BackendBaseEvent {
    element_id: string;
    from_dropdown: boolean;
};

export interface BackendHoverEvent extends BackendBaseEvent {
    element_id: string;
    end_timestamp: number;
    duration: number;
};

export interface BackendPageTransitionEvent extends BackendBaseEvent {
    next_page_url: string;
    time_spent: number;
};

