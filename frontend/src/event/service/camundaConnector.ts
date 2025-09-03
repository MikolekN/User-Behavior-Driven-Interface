import { User } from "../../components/utils/User";
import { validateSchema } from "../../schemas/apiValidation/validator";
import { EVENT_API_URL } from "../../services/constants";
import { handleApiResponse } from "../../services/handleApiResponse";
import { GenerateProcessModelResponse, GenerateProcessModelResponseSchema, GetNextStepResponse, GetNextStepResponseSchema, RunProcessInstanceResponse, RunProcessInstanceResponseSchema } from "../schemas/camundaResponseSchemas";


export const runProcessInstance = async (user: User): Promise<RunProcessInstanceResponse> => {
    const response = await fetch(`${EVENT_API_URL}/processes/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<RunProcessInstanceResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: RunProcessInstanceResponseSchema, schemaName: 'run_process_instance' });
};

export const generateProcessModel = async (user: User): Promise<GenerateProcessModelResponse> => {
    const response = await fetch(`${EVENT_API_URL}/processes/generate/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GenerateProcessModelResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GenerateProcessModelResponseSchema, schemaName: 'generate_process_model' });
};

export const getNextStep = async (user: User): Promise<GetNextStepResponse> => {
    const response = await fetch(`${EVENT_API_URL}/processes/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token!
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetNextStepResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetNextStepResponseSchema, schemaName: 'get_next_step' });
};
