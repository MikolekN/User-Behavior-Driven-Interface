import { useContext, useEffect } from "react";
import useApiErrorHandler from "./useApiErrorHandler";
import { PreferencesContext } from "../event/context/PreferencesContext";
import { UserContext } from "../context/UserContext";


function useAutoRedirectPreference() {
	const { getAutoRedirectPreference } = useContext(PreferencesContext);
	const { handleError } = useApiErrorHandler();
	const { user } = useContext(UserContext);

    useEffect(() => {
		if (!user) return;
	
		const fetchAutoRedirectPreferences = async () => {
		  try {
			getAutoRedirectPreference();
		  } catch (error) {
			handleError(error);
		  }
		};
	
		void fetchAutoRedirectPreferences();
	  }, [user, getAutoRedirectPreference]);
}

export default useAutoRedirectPreference;
