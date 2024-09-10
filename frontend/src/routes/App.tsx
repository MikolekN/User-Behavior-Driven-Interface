import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { User } from '../components/utils/User';

const App: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
	const checkLoginStatus = async () => {
		setUser(null);
		try {
			const response = await fetch('http://127.0.0.1:5000/api/user', {
				method: 'GET',
				credentials: 'include'
			});
			if (response.ok) {
				const data = await response.json();
				if (data.user) {
					setUser(new User(
						data.user.login,
						data.user.account_name,
						data.user.account_number,
						data.user.blockades.toFixed(2),
						data.user.balance.toFixed(2),
						data.user.currency)
					)
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
	<Layout user={user} setUser={setUser}>
		<Outlet context={{ user, setUser }} />
	</Layout>
  );
};

export default App;
