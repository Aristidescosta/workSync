import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthenticationPage } from '@pages';


export default function RoutesConfig() {


	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<h1 className="text-3xl uppercase">Work Sync | Gestão inteligente</h1>
			),
			errorElement: (
				<h1>Not found</h1>
			)
		},
		{
			path: '/auth/sign-in',
			element: (
				<AuthenticationPage />
			),
			errorElement: (
				<h1>Not found</h1>
			)
		}
	])

	return <RouterProvider router={router} />
}
