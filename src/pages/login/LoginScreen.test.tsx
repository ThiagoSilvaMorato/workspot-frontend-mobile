import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { LoginScreen } from './LoginScreen';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

const mockLogin = jest.fn();
jest.mock('@/features/auth/hooks/useLogin', () => ({
  useLogin: () => ({
    mutate: mockLogin,
    isPending: false,
  }),
}));

async function renderLoginScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    </QueryClientProvider>,
  );
}

describe('LoginScreen', () => {
  afterEach(async () => {
    // Flush all pending React state updates before cleanup
    await act(async () => {});
    cleanup();
    jest.clearAllMocks();
  });

  it('renderiza os campos de email e senha', async () => {
    const { getByTestId } = await renderLoginScreen();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
  });

  it('renderiza o título WorkSpot', async () => {
    const { getByText } = await renderLoginScreen();
    expect(getByText('WorkSpot')).toBeTruthy();
  });

  it('exibe erro quando email está vazio ao submeter', async () => {
    const { getByTestId, getByText } = await renderLoginScreen();

    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(getByText('Email é obrigatório')).toBeTruthy();
    });
  });

  it('exibe erro quando senha está vazia ao submeter', async () => {
    const { getByTestId, getByText } = await renderLoginScreen();

    await act(async () => {
      fireEvent.changeText(getByTestId('email-input'), 'teste@example.com');
      fireEvent.press(getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(getByText('Senha é obrigatória')).toBeTruthy();
    });
  });

  it('exibe erro quando email é inválido', async () => {
    const { getByTestId, getByText } = await renderLoginScreen();

    await act(async () => {
      fireEvent.changeText(getByTestId('email-input'), 'nao-e-email');
      fireEvent.changeText(getByTestId('password-input'), 'senha123');
      fireEvent.press(getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(getByText('Digite um email válido')).toBeTruthy();
    });
  });

  it('chama useLogin com dados corretos em formulário válido', async () => {
    const { getByTestId } = await renderLoginScreen();

    await act(async () => {
      fireEvent.changeText(getByTestId('email-input'), 'teste@example.com');
      fireEvent.changeText(getByTestId('password-input'), 'senha123');
      fireEvent.press(getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { email: 'teste@example.com', password: 'senha123' },
        expect.objectContaining({ onError: expect.any(Function) }),
      );
    });
  });
});
