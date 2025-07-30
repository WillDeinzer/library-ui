import { Button, Group, Modal, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { postData } from "@/app/services/apiService";
import { setSessionItem } from "@/app/services/sessionService";


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
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Handle sign-in and account creation

  const handleSignIn = () => {
    setLoading(true);
    const loginData = {
      "username": username,
      "password": password,
      "email": null
    }
    console.log("Signing in...");
    postData("login", loginData)
      .then((response) => {
        console.log("Logged in successfully.");
        console.log("Response:", response);
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        console.log("Error logging in:", error);
        setLoading(false);
      });
  }

  const handleCreateAccount = () => {
    setLoading(true);
    const accountData = {
      "username": username,
      "password": password,
      "email": email || null
    }
    console.log("Creating account...");
    postData("create_account", accountData)
      .then((response) => {
        console.log("Account created successfully. Logged in.");
        console.log("Response:", response);
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        console.log("Error creating account:", error);
        setLoading(false);
      })
  }

  // Reset fields when modal opens

  useEffect(() => {
    if (opened) {
      setUsername("");
      setPassword("");
      setSignType("SignIn");
      setEmail("");
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
                <Button color="blue" loading={loading} onClick={() => handleSignIn()}>Sign In</Button>
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
                <TextInput
                    label="Email"
                    placeholder="Enter your email (optional)"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    style={{ width: "100%"}}
                />
                <Button color="blue" loading={loading} onClick={() => handleCreateAccount()}>Create Account</Button>
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