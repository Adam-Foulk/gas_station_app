import { useNavigate } from 'react-router-dom';

import { usePocketbase } from '../contexts/PocketbaseContext';
import { useCallback, useEffect } from 'react';
import { Box, Button, Center, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

type FormData = { username: string; password: string };

export const SignIn = () => {
  const { login, user } = usePocketbase();
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
      await login(username, password);
      navigate('/');
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
