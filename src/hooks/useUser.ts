import { AuthModel } from 'pocketbase';
import { usePocketbase } from '../contexts/PocketbaseContext';

export const useUser = () => {
  const { pb } = usePocketbase();

  const getUser = async (username: string): Promise<AuthModel> => {
    return pb.collection('users').getFirstListItem(`username="${username}" || email="${username}"`);
  };

  const createCurrentSession = async (userId: string) => {
    await pb.collection('session').create({
      user: userId,
      loggedin_at: new Date(),
    });
  };

  const getCurrentSession = async (userId: string): Promise<{ id: string }> => {
    return await pb.collection('session').getFirstListItem(`user="${userId}" && loggedout_at = ""`);
  };

  const destroyCurrentSession = async (sessionId: string) => {
    await pb.collection('session').update(sessionId, {
      loggedout_at: new Date(),
    });
  };

  return { getUser, createCurrentSession, getCurrentSession, destroyCurrentSession };
};
