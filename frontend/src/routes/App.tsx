import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const App: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");

  useEffect(() => {
	const checkLoginStatus = async () => {
		setUsername("");
		setIsLoggedIn(false);
		try {
		const response = await fetch('http://127.0.0.1:5000/api/user', {
			method: 'GET',
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			if (data.user) {
			setUsername(data.user.login);
			setIsLoggedIn(true);
			}
		} else {
			console.error('Failed to fetch current user:', response.status);
		}
		} catch (error) {
			console.error('Error checking user login status:', error);
		}
	};

	checkLoginStatus();
  }, []);

  return (
	<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername}>
		<Outlet context={{ isLoggedIn, setIsLoggedIn, username, setUsername }} />
	</Layout>
  );
};

export default App;
