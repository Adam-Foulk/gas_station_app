import { useNavigate } from 'react-router-dom';

import { usePocketbase } from '../contexts/PocketbaseContext';
import { useCallback, useEffect } from 'react';
import { Box, Button, Center, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUser } from '../hooks/useUser';
import { notifications } from '@mantine/notifications';

type FormData = { username: string; password: string };

export const SignIn = () => {
  const { login, user } = usePocketbase();
  const { getUser, createCurrentSession, getCurrentSession } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => (value.length < 2 ? 'Username must have at least 2 letters' : null),
      password: (value) => (value.length < 10 ? 'Password must have at least 10 letters' : null),
    },
  });

  const handleOnSubmit = useCallback(
    async ({ username, password }: FormData) => {
      try {
        const targetUser = await getUser(username);
        try {
          const ses = await getCurrentSession(targetUser!.id);
          console.log(ses);
          notifications.show({
            title: 'Login',
            message: 'This user already logged in on another desk',
            color: 'red',
          });
        } catch {
          await login(username, password);
          await createCurrentSession(targetUser!.id);
          notifications.show({
            title: 'Login',
            message: 'Logged in successfully',
            color: 'green',
          });
          navigate('/');
        }
      } catch (err) {
        notifications.show({
          title: 'Login',
          message: 'User not found',
          color: 'red',
        });
      }
    },
    [login],
  );

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <section>
      <Center w={'100vw'}>
        <Box maw={340} mx="auto" w={300}>
          <h2>Sign In</h2>
          <form onSubmit={form.onSubmit(handleOnSubmit)}>
            <TextInput label="Username" placeholder="Username" {...form.getInputProps('username')} />
            <TextInput mt="sm" label="Password" placeholder="Password" {...form.getInputProps('password')} />
            <Button type="submit" mt="sm">
              Submit
            </Button>
          </form>
        </Box>
      </Center>
    </section>
  );
};
