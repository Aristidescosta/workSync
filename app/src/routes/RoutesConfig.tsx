import { Authentication } from '@pages/Authentication';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useUserSessionStore } from '@hooks/useUserSession';
import { BaseLayoutPage } from '../layouts/BaseLayoutPage';
import { Projects } from '../pages';
import { Home } from '@pages/home';
import { TeamPage } from '../pages/teams';
import { WorkSpacesPage } from '../pages/workspaces';

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
			path: '/home',
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
			path: '/home/:teamId',
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
			path: '/home/:teamId/:workspaceName/team',
			element: (
				<BaseLayoutPage>
					<TeamPage />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/tasks',
			element: (
				<BaseLayoutPage>
					<TeamPage />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/graphs',
			element: (
				<BaseLayoutPage>
					<TeamPage />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/files',
			element: (
				<BaseLayoutPage>
					<TeamPage />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: '/home/:teamId/:workspaceName/workspaces',
			element: (
				<BaseLayoutPage>
					<WorkSpacesPage />
				</BaseLayoutPage>
			),
			errorElement: (
				<h1>Not found</h1>
			),
			loader: isAuthenticate
		},
		{
			path: '/auth',
			element: <Authentication />,
			errorElement: (
				<h1>Not found</h1>
			),
		},
	]);

	return <RouterProvider router={router} />;
}
