import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useUserSessionStore } from '@/src/hooks';
import { useToastMessage } from '@/react-toastify';
import { AuthenticationPage } from '@/src/pages';

jest.mock('@/src/hooks', () => ({
    useUserSessionStore: jest.fn()
}));

jest.mock('@/react-toastify', () => ({
    useToastMessage: jest.fn(() => ({
        toastMessage: jest.fn(),
        ToastStatus: { ERROR: 'error' }
    }))
}));

describe('AuthenticationPage', () => {
    const mockNavigate = jest.fn();
    const mockSignInWithGoogle = jest.fn(() => Promise.resolve());
    const mockSignInWithEmailAndPassword = jest.fn(() => Promise.resolve());
    const mockSetUserEmail = jest.fn();
    const mockSetUserPassword = jest.fn();
    const mockToastMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useUserSessionStore as jest.Mock).mockReturnValue((selector: any) => {
            switch (selector) {
                case 'signInWithGoogle':
                    return mockSignInWithGoogle;
                case 'signInWithEmailAndPassword':
                    return mockSignInWithEmailAndPassword;
                case 'setUserEmail':
                    return mockSetUserEmail;
                case 'setUserPassword':
                    return mockSetUserPassword;
                case 'loadingUserSession':
                    return false;
                default:
                    return jest.fn();
            }
        });

        (useToastMessage as jest.Mock).mockReturnValue({
            toastMessage: mockToastMessage,
            ToastStatus: { ERROR: 'error' }
        });

        render(
            <BrowserRouter>
                <AuthenticationPage />
            </BrowserRouter>
        );
    });

    test('deve renderizar corretamente', () => {
        expect(screen.getByText(/Inicie sessão na sua conta/i)).toBeInTheDocument();
        expect(screen.getByText(/Google/i)).toBeInTheDocument();
        expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
    });

    test('deve chamar signInWithGoogle ao clicar no botão de login com Google', async () => {
        const googleButton = screen.getByText(/Google/i);
        fireEvent.click(googleButton);
        await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1));
    });

    test('deve preencher e submeter o formulário', async () => {
        const emailInput = screen.getByPlaceholderText(/Insira o seu e-mail/i);
        const passwordInput = screen.getByPlaceholderText(/Insira a sua senha/i);
        const submitButton = screen.getByText(/Entrar/i);

        fireEvent.change(emailInput, { target: { value: 'teste@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'senha123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSetUserEmail).toHaveBeenCalledWith('teste@email.com');
            expect(mockSetUserPassword).toHaveBeenCalledWith('senha123');
            expect(mockSignInWithEmailAndPassword).toHaveBeenCalledTimes(1);
        });
    });

    test('deve exibir erro se o login falhar', async () => {
        mockSignInWithEmailAndPassword.mockRejectedValueOnce(new Error('Erro de autenticação'));

        const emailInput = screen.getByPlaceholderText(/Insira o seu e-mail/i);
        const passwordInput = screen.getByPlaceholderText(/Insira a sua senha/i);
        const submitButton = screen.getByText(/Entrar/i);

        fireEvent.change(emailInput, { target: { value: 'teste@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'senha123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockToastMessage).toHaveBeenCalledWith({
                title: expect.any(Error),
                statusToast: 'error',
                position: 'top-right'
            });
        });
    });
});
