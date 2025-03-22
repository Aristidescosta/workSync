import { AuthenticationPage, CreateEmailAccountForm } from '@pages/Authentication';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useUserSessionStore } from '@hooks/useUserSession';
import { BaseLayoutPage } from '../layouts/BaseLayoutPage';
import { Projects } from '../pages';
import { Home } from '@pages/home';

export default function RoutesConfig() {
	const isAuthenticate = useUserSessionStore(state => state.isAuthenticationRoute)

	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<BaseLayoutPage>
					<Home />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: "/projects",
			element: (
				<BaseLayoutPage>
					<Projects />
				</BaseLayoutPage>
			)
		},
		{
			path: '/auth',
			children: [
				{
					path: 'sign-in',
					element: <AuthenticationPage />,
				},
				{
					path: 'sign-up',
					element: <CreateEmailAccountForm />,
				},
			],
			errorElement: (
				<h1>Not found</h1>
			),
		},
	]);

	return <RouterProvider router={router} />;
}
