import { Authentication } from '@pages/Authentication';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useUserSessionStore } from '@hooks/useUserSession';
import { BaseLayoutPage } from '../layouts/BaseLayoutPage';
import { Projects } from '../pages';
import { Home } from '@pages/home';
import { TeamPage } from '../pages/teams';

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
			children: [
				{
					path:":teamId",
					element: <Home />
				},
				{
					path:":teamId/:workspaceName/team",
					element: <TeamPage />
				},
				{
					path:":teamId/:workspaceName/tasks",
					element: <TeamPage />
				},
				{
					path:":teamId/:workspaceName/graphs",
					element: <TeamPage />
				},
				{
					path:":teamId/:workspaceName/files",
					element: <TeamPage />
				},
				{
					path:":teamId/:workspaceName/workspaces",
					element: <TeamPage />
				},
			],
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
			element: <Authentication />,
			errorElement: (
				<h1>Not found</h1>
			),
		},
	]);

	return <RouterProvider router={router} />;
}
