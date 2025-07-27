import { Button, Title, Text } from '@mantine/core';

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <Title>Hello from Mantine!</Title>
      <Text>This is an example of a component using Mantine</Text>
      <Button mt="md" color="blue">Click this button!</Button>
    </main>
  );
}
