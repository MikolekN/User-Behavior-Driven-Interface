interface NextStepObject {
    bpmn_element_id: string;
    message: string;
    page: string;
    next_page: string;
    probability: string;
    visits: number;
}

export interface BackendNextStepPreference {
    message: string;
    next_step: NextStepObject;
};

export interface NextStepPreference {
    nextPage: string;
};

export const mapBackendNextStepPreferenceToNextStepPreference = (preferencesBackendData: BackendNextStepPreference): NextStepPreference => {
    return {
        nextPage: preferencesBackendData.next_step.next_page
    };
};
