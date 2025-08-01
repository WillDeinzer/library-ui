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
  const [error, setError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

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
      .then((response: any) => {
        if (response.error) {
          console.log("Error logging in:", response.error);
          setError(true);
          handleError(response.error);
          setLoading(false);
        } else {
          console.log("Logged in successfully.");
          console.log("Response:", response);
          setLoading(false);
          showSignedIn(response.username);
          setDefaults();
          onClose();
        }
      })
      .catch((error) => {
        console.log("Error logging in:", error);
        setError(true);
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
      .then((response: any) => {
        if (response.error) {
          console.log("Error creating account:", response.error);
          setError(true);
          handleError(response.error);
          setLoading(false);
        } else {
          console.log("Account created successfully.");
          console.log("Response:", response);
          setLoading(false);
          showSignedIn(response.username);
          setDefaults();
          onClose();
        }
      })
      .catch((error) => {
        console.log("Error creating account:", error);
        setError(true);
        setLoading(false);
      });
  }

  const showSignedIn = (username: string) => {
    setSessionItem("username", username);
    setSessionItem("loggedIn", true);
    console.log("User signed in:", username);
  }

  const handleError = (error: any) => {
    if (error.includes("does not exist")) {
      setUsernameErrorMessage("An account with this username does not exist.");
      setPasswordErrorMessage("");
    } else if (error.includes("Incorrect password")) {
      setUsernameErrorMessage("");
      setPasswordErrorMessage("The password you entered is incorrect.");
    } else if (error.includes("already exists")) {
      setUsernameErrorMessage("An account with this username or email already exists.");
      setPasswordErrorMessage("");
    } else {
      setUsernameErrorMessage("An unexpected error occurred. Please try again.");
      setPasswordErrorMessage("");
    }
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

  useEffect(() => {
    if (!opened) {
      setDefaults();
    }
  }, [opened]);

  // Reset fields to defaults
  const setDefaults = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setError(false);
    setUsernameErrorMessage("");
    setPasswordErrorMessage("");
    setError(false);
    setSignType("SignIn");
  }

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
                    onChange={(event) => {
                      setUsername(event.currentTarget.value);
                      if (error) setError(false);
                    }}
                    style={{ width: "100%" }}
                    error={error ? usernameErrorMessage : undefined}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                      if (error) setError(false);
                    }}
                    style={{ width: "100%" }}
                    error={error ? passwordErrorMessage : undefined}
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
                    onChange={(event) => {
                      setUsername(event.currentTarget.value);
                      if (error) setError(false);
                    }}
                    style={{ width: "100%" }}
                    error={error ? usernameErrorMessage : undefined}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Choose a password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                      if (error) setError(false);
                    }}
                    style={{ width: "100%" }}
                    error={error ? passwordErrorMessage : undefined}
                />
                <TextInput
                    label="Email"
                    placeholder="Enter your email (optional)"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                      if (error) setError(false);
                    }}
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