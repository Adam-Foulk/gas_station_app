import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { usePocketbase } from '../contexts/PocketbaseContext';
import { AppShell, Avatar, Burger, Button, Flex, Menu, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { nameToInitials } from '../utils/nameToInitials';
import { useUser } from '../hooks/useUser';

export const AuthLayout = () => {
  const { user, logout } = usePocketbase();
  const { destroyCurrentSession, getCurrentSession } = useUser();
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const handleLogout = async () => {
    const currentSession = await getCurrentSession(user?.id);
    if (currentSession) {
      await destroyCurrentSession(currentSession.id);
      logout();
    }
  };

  const toggleColorScheme = () => {
    switch (colorScheme) {
      case 'dark':
        setColorScheme('light');
        return;
      case 'light':
        setColorScheme('auto');
        return;
      case 'auto':
        setColorScheme('dark');
    }
  };

  if (!user) {
    return <Navigate to={{ pathname: '/sign-in' }} state={{ location }} replace />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 0,
        breakpoint: 'xs',
        collapsed: { desktop: true, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header p={0}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Flex justify={'end'} align={'center'} p={10} h={'100&'}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="transparent" h={40}>
                <Avatar color="cyan" radius="xl">
                  {nameToInitials(user.name)}
                </Avatar>
                <span style={{ marginLeft: 8 }}>{user.name}</span>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={toggleColorScheme}>Color scheme: {colorScheme}</Menu.Item>
              <Menu.Item color="red" onClick={handleLogout}>
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
