import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthenticationPage, CreateEmailAccountForm } from '@pages/Authentication';

export default function RoutesConfig() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <h1 className="text-3xl uppercase">Work Sync | Gestão inteligente</h1>
      ),
      errorElement: (
        <h1>Not found</h1>
      ),
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
