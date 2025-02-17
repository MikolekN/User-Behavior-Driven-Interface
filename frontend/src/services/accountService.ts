
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
import { Account, BackendAccount } from "../components/utils/types/Account";
import { CreateAccountResponse, CreateAccountResponseSchema, DeleteAccountResponse, DeleteAccountResponseSchema, GetAccountResponse, GetAccountResponseSchema, GetAccountsListResponse, GetAccountsListResponseSchema, GetActiveAccountResponse, GetActiveAccountResponseSchema, SetActiveAccountResponse, SetActiveAccountResponseSchema, UpdateAccountResponse, UpdateAccountResponseSchema } from "../schemas/apiValidation/accountResponseSchema";
import { validateSchema } from "../schemas/apiValidation/validator";
import { API_URL } from "./constants";
import { handleApiResponse } from "./handleApiResponse";

export const createAccountData = async (requestBody: object): Promise<CreateAccountResponse> => {
    const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<CreateAccountResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: CreateAccountResponseSchema, schemaName: 'create/account' });
}

export const updateAccountData = async (accountNumber: string, requestBody: object): Promise<UpdateAccountResponse> => {
    const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<UpdateAccountResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: UpdateAccountResponseSchema, schemaName: 'update/account' });
}

export const deleteAccountData = async (accountNumber: string): Promise<DeleteAccountResponse> => {
    const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<DeleteAccountResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: DeleteAccountResponseSchema, schemaName: 'delete/account' });
}

export const getAccountData = async (accountNumber: string): Promise<GetAccountResponse> => {
    const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetAccountResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetAccountResponseSchema, schemaName: 'get/account' });
}

export const getAccountsData = async (): Promise<GetAccountsListResponse> => {
    const response = await fetch(`${API_URL}/accounts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    const apiResponse = await handleApiResponse<GetAccountsListResponse>(response);
    
    return validateSchema({ dto: apiResponse, schema: GetAccountsListResponseSchema, schemaName: 'get/accounts' });
}

export const getActiveAccountData = async (): Promise<GetActiveAccountResponse> => {

	const response = await fetch(`${API_URL}/accounts/active`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	const apiResponse = await handleApiResponse<GetActiveAccountResponse>(response);

	return validateSchema({ dto: apiResponse, schema: GetActiveAccountResponseSchema, schemaName: 'get/active/account' });
}

export const setActiveAccountData = async (account_number: string): Promise<SetActiveAccountResponse> => {
	const response = await fetch(`${API_URL}/accounts/active/${account_number}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	const apiResponse = await handleApiResponse<SetActiveAccountResponse>(response);
	
	return validateSchema({ dto: apiResponse, schema: SetActiveAccountResponseSchema, schemaName: 'set/active/account' });
}