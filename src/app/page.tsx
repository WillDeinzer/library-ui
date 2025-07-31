"use client";
import { ActionIcon, AppShell, Button, Group, Title, Text, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import AccountModal from './components/account/accountModal';
import { getSessionItem, setSessionItem } from './services/sessionService';
import React from 'react';

export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true});
  const [accountModalOpened, setAccountModalOpened] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const onClose = () => {
    setAccountModalOpened(false);
    if (getSessionItem("loggedIn")) {
      setLoggedIn(true);
    }
  }

  const signOut = () => {
    setSessionItem("loggedIn", false);
    setSessionItem("username", null);
    setLoggedIn(false);
    console.log("User signed out");
  }

  useEffect(() => {
    const isLoggedIn = getSessionItem("loggedIn") && getSessionItem("loggedIn") === true;
    setLoggedIn(isLoggedIn);
  }, []);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Title order={2}>Northwest Buffalo Community Library</Title>
          </div>
          <Group align="center" style={{ paddingRight: '1rem' }}>
            <ActionIcon
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              variant="default"
              size="xl"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
            </ActionIcon>
            {loggedIn ? (
              <Button color="blue" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button color="blue" onClick={() => setAccountModalOpened(true)}>
                Sign In
              </Button>
            )}
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Navbar>Navbar</AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
      <AccountModal opened={accountModalOpened} onClose={onClose} />
    </AppShell>
  );
}