"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppShell,
  Group,
  Title,
  Burger,
  ActionIcon,
  Button,
  Stack,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon, IconHome, IconBook, IconMessage, IconTrophy } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import AccountModal from "../account/accountModal";
import { getSessionItem, setSessionItem } from "@/app/services/sessionService";
import { useAuth } from "@/app/contexts/authContext";

export default function Shell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure(false);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true});
    const [accountModalOpened, setAccountModalOpened] = useState(false);

    const { isSignedIn, signOut } = useAuth();

    const onClose = () => {
        setAccountModalOpened(false);
    }

    const navItems = [
        { label: "Home", icon: IconHome, href: "/" },
        { label: "Books", icon: IconBook, href: "/bookCatalog" },
        { label: "Book Chat", icon: IconMessage, href: "/bookChat" },
        { label: "Contests", icon: IconTrophy, href: "/contests" },
    ];

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
                <Burger 
                    opened={opened}
                    onClick={toggle}
                    aria-label="Toggle navigation"
                    hiddenFrom="sm"
                    size="sm"
                    style={{ paddingLeft: '1rem '}} 
                />
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
                    {isSignedIn ? (
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

            <AppShell.Navbar>
                <Text ta="center" size="md" style={{ marginTop: '1rem '}}>Pages</Text>
                <Stack style={{ padding: '1rem' }}>
                {navItems.map(({ label, icon: Icon, href }) => (
                    <Link key={label} href={href}>
                    <Group style={{ margin: '1rem'}}>
                        <Icon size={24} />
                        <Text size="sm">{label}</Text>
                    </Group>
                    </Link>
                ))}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>

            <AccountModal opened={accountModalOpened} onClose={onClose} />
        </AppShell>
    );
}