
import { Account, BackendAccount } from "../components/utils/types/Account";
import { CreateAccountResponse, CreateAccountResponseSchema, DeleteAccountResponse, DeleteAccountResponseSchema, GetAccountResponse, GetAccountResponseSchema, GetAccountsListResponse, GetAccountsListResponseSchema, GetActiveAccountResponse, SetActiveAccountResponse, UpdateAccountResponse, UpdateAccountResponseSchema } from "../schemas/apiValidation/accountResponseSchema";
import { validateSchema } from "../schemas/apiValidation/validator";
import { API_URL } from "./constants";
import { handleApiResponse } from "./handleApiResponse";

export const createAccountData = async (requestBody: object): Promise<CreateAccountResponse> => {

    // const response = await fetch(`${API_URL}/accounts`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(requestBody),
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<CreateAccountResponse>(response);
    
    // return validateSchema({ dto: apiResponse, schema: CreateAccountResponseSchema, schemaName: 'create/account' });

    const account: BackendAccount = {
        _id: '63f4c8a1b5a3e9001b7a1c01',
        account_name: 'Personal Savings',
        account_number: '100100100',
        blockades: 0,
        balance: 1500.75,
        currency: 'USD',
        account_type: 'youth',
    }
    
    return {
        message: "account create",
        account: account
    }
}

export const updateAccountData = async (accountNumber: string, requestBody: object): Promise<UpdateAccountResponse> => {
    // const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(requestBody),
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<UpdateAccountResponse>(response);
    
    // return validateSchema({ dto: apiResponse, schema: UpdateAccountResponseSchema, schemaName: 'update/account' });

    const account: BackendAccount = {
        _id: '63f4c8a1b5a3e9001b7a1c01',
        account_name: 'Personal Savings',
        account_number: '100100100',
        blockades: 0,
        balance: 1500.75,
        currency: 'USD',
        account_type: 'savings',
    }
    
    return {
        message: "account update",
        account: account
    }
}

export const deleteAccountData = async (accountNumber: string): Promise<DeleteAccountResponse> => {
    // const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<DeleteAccountResponse>(response);
    
    // return validateSchema({ dto: apiResponse, schema: DeleteAccountResponseSchema, schemaName: 'delete/account' });


    return {
        message: "account delete"
    }
}

export const getAccountData = async (accountNumber: string): Promise<GetAccountResponse> => {
    // const response = await fetch(`${API_URL}/accounts/${accountNumber}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<GetAccountResponse>(response);
    
    // return validateSchema({ dto: apiResponse, schema: GetAccountResponseSchema, schemaName: 'get/account' });
    
    
    const mockAccount: BackendAccount = {
      _id: '63f4c8a1b5a3e9001b7a1c01',
      account_name: 'Personal Savings',
      account_number: '100100100',
      blockades: 0,
      balance: 1500.75,
      currency: 'USD',
      accountaccount_type: 'savings',
    }

    return {
        message: "ok",
        account: mockAccount
    };
}

export const getAccountsData = async (): Promise<GetAccountsListResponse> => {
    // const response = await fetch(`${API_URL}/accounts`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     credentials: 'include'
    // });

    // const apiResponse = await handleApiResponse<GetAccountsListResponse>(response);
    
    // return validateSchema({ dto: apiResponse, schema: GetAccountsListResponseSchema, schemaName: 'get/accounts' });
    
    
    const mockAccounts: BackendAccount[] = [
        {
          _id: '63f4c8a1b5a3e9001b7a1c01',
          account_name: 'Personal Savings',
          account_number: '100100100',
          blockades: 0,
          balance: 1500.75,
          currency: 'USD',
          account_type: 'savings',
        },
        {
          _id: '63f4c8a1b5a3e9001b7a1c02',
          account_name: 'Business Checking',
          account_number: '200200200',
          blockades: 2,
          balance: 35000.5,
          currency: 'USD',
          account_type: 'personal',
        },
        {
          _id: '63f4c8a1b5a3e9001b7a1c03',
          account_name: 'Investment Account',
          account_number: '300300300',
          blockades: 0,
          balance: 7800.25,
          currency: 'EUR',
          account_type: 'retirement',
        },
        {
          _id: '63f4c8a1b5a3e9001b7a1c04',
          account_name: 'Student Savings',
          account_number: '400400400',
          blockades: 1,
          balance: 500.0,
          currency: 'GBP',
          account_type: 'savings',
        },
        {
          _id: '63f4c8a1b5a3e9001b7a1c05',
          account_name: 'Corporate Account',
          account_number: '500500500',
          blockades: 3,
          balance: 125000.99,
          currency: 'USD',
          account_type: 'currency',
        },
      ];

    return {
        message: "ok",
        accounts: mockAccounts
    };
}

export const getActiveAccountData = async (): Promise<GetActiveAccountResponse> => {

  // const response = await fetch(`${API_URL}/accounts/active`, {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     credentials: 'include'
  // });

  // const apiResponse = await handleApiResponse<GetActiveAccountResponse>(response);
  
  // return validateSchema({ dto: apiResponse, schema: CreateAccountResponseSchema, schemaName: 'get/active/account' });

  const account: BackendAccount = {
      _id: '63f4c8a1b5a3e9001b7a1c01',
      account_name: 'Personal Savings',
      account_number: '100100100',
      blockades: 0,
      balance: 1500.75,
      currency: 'USD',
      account_type: 'youth',
  }
  
  return {
      message: "account create",
      account: account
  }
}

export const setActiveAccountData = async (account_number: string): Promise<SetActiveAccountResponse> => {

  // const response = await fetch(`${API_URL}/accounts/set_active/${account_number}`, {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     credentials: 'include'
  // });

  // const apiResponse = await handleApiResponse<SetActiveAccountResponse>(response);
  
  // return validateSchema({ dto: apiResponse, schema: CreateAccountResponseSchema, schemaName: 'set/active/account' });

  const account: BackendAccount = {
      _id: '63f4c8a1b5a3e9001b7a1c01',
      account_name: 'Personal Savings',
      account_number: '100100100',
      blockades: 0,
      balance: 1500.75,
      currency: 'USD',
      account_type: 'youth',
  }
  
  return {
      message: "account create",
      account: account
  }
}