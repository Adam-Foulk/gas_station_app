import { createContext, useContext, useCallback, useState, useEffect, useMemo, ReactElement } from 'react';
import PocketBase, { AuthModel, RecordAuthResponse, RecordModel } from 'pocketbase';
import { useInterval } from 'usehooks-ts';
import { jwtDecode } from 'jwt-decode';

type PocketbaseProviderProps = {
  children: ReactElement;
};

type PocketbaseProviderValue = {
  register(usernameOrEmail: string, password: string): Promise<RecordModel>;
  login(usernameOrEmail: string, password: string): Promise<RecordAuthResponse<RecordModel>>;
  logout(): void;
  user: AuthModel;
  token: string;
  pb: PocketBase;
};

const BASE_URL = import.meta.env.VITE_POCKETBASE_BASE_URL;
const fiveMinutesInMs = 5 * 60000;
const twoMinutesInMs = 2 * 60000;

const PocketContext = createContext<PocketbaseProviderValue>({} as PocketbaseProviderValue);

export const PocketbaseProvider = ({ children }: PocketbaseProviderProps) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (usernameOrEmail: string, password: string) => {
    return await pb.collection('users').create({ usernameOrEmail, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (usernameOrEmail: string, password: string) => {
    return await pb.collection('users').authWithPassword(usernameOrEmail, password);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp! + fiveMinutesInMs) / 1000;
    if (tokenExpiration! < expirationWithBuffer) {
      await pb.collection('users').authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider value={{ register, login, logout, user, token, pb }}>{children}</PocketContext.Provider>
  );
};

export const usePocketbase = () => useContext<PocketbaseProviderValue>(PocketContext);
