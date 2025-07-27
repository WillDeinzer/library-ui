import { Button, Group, Modal, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import React, { useEffect } from "react";

export default function AccountModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [signType, setSignType] = React.useState<string>("SignIn");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignIn = () => {
    // Handle sign-in logic here
    console.log("Signing in...");
    onClose();
  }

  const handleCreateAccount = () => {
    // Handle account creation logic here
    console.log("Creating account...");
    onClose();
  }

  useEffect(() => {
    if (opened) {
      setUsername("");
      setPassword("");
      setSignType("SignIn");
    }
  }, []);

  return (
    <Modal size="lg" opened={opened} onClose={onClose} withCloseButton={false} centered>
      <Stack align="center">
        {signType === "SignIn" ? (
            <>
                <Text size="lg">Sign in to use this website's features!</Text>
                <TextInput
                    label="Username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    style={{ width: "100%" }}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    style={{ width: "100%" }}
                />
                <Button color="blue" onClick={() => handleSignIn()}>Sign In</Button>
                <Group justify="center" style={{ width: "100%" }}>
                    <Text size="sm">Don't have an account?</Text>
                    <Button size="xs" color="blue" onClick={() => setSignType("CreateAccount")}>Create an Account</Button>
                </Group>
            </>
        ) : (
            <>
                <Text size="lg">Create a new account</Text>
                <TextInput
                    label="Username"
                    placeholder="Choose a username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                    style={{ width: "100%" }}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Choose a password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    style={{ width: "100%" }}
                />
                <Button color="blue" onClick={() => handleCreateAccount()}>Create Account</Button>
                <Group justify="center" style={{ width: "100%" }}>
                    <Text size="sm">Already have an account?</Text>
                    <Button size="xs" color="blue" onClick={() => setSignType("SignIn")}>Sign In</Button>
                </Group>
            </>
        )}
      </Stack>
    </Modal>
  );
}