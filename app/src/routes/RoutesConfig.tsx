import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from "@pages/Home";
import HomeManageTeamPage from "@pages/Home/HomeManageTeamPage";
import { useUserSessionStore } from "@hooks/useUserSession";
import NotFound from '@pages/NotFound';
import ResetPasswordPage from '../pages/Authentication/ResetPasswordPage';

export default function RoutesConfig() {

	const isAuthenticate = useUserSessionStore(state => state.isAuthenticationRoute)

	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<HomeManageTeamPage />
			),
			errorElement: (
				<NotFound />
			)
		},
		{
			path: '/invite',
			element: (
				<HomeManageTeamPage />
			),
			errorElement: (
				<NotFound />
			)
		},
		{
			path: '/resetpassword',
			element: (
				<ResetPasswordPage />
			),
			errorElement: (
				<NotFound />
			)
		},
		{
			path: '/home',
			element: (
				<HomeManageTeamPage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/tasks',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/tasks/:taskId',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/team',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/graphs',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/settings',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/workspaces',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/files',
			element: (
				<HomePage />
			),
			errorElement: (
				<NotFound />
			),
			loader: isAuthenticate
		},
	])

	return <RouterProvider router={router} />
}
