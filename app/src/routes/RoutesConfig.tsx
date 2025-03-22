import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthenticationPage, CreateEmailAccountForm } from '@pages/Authentication';
import { Home } from '@pages/home';
import { useUserSessionStore } from '@hooks/useUserSession';
import { BaseLayoutPage } from '../layouts/BaseLayoutPage';

export default function RoutesConfig() {
	const isAuthenticate = useUserSessionStore(state => state.isAuthenticationRoute)

	const router = createBrowserRouter([
		{
			path: '/',
			element: <BaseLayoutPage />,
			errorElement: (
				<h1>Not found</h1>
			),
			children: [
				{
					path: ".",
					element: (
						<Home />
					)
				}
			],
			loader: isAuthenticate
		},
		{
			path: '/auth',
			children: [
				/* {
				  path: '',  // Rota principal de autenticação, sem o "/"
				  element: <AuthenticationPage />,
				}, */
				{
					path: 'sign-in',  // Caminho relativo para o login
					element: <AuthenticationPage />,
				},
				{
					path: 'sign-up',  // Caminho relativo para o cadastro
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
