"use client";

import { Carousel } from "@mantine/carousel";
import { 
    Container, 
    Paper, 
    Title, 
    Button, 
    Image, 
    Text, 
    Box, 
    SimpleGrid,
    Group
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import '@mantine/carousel/styles.css';

export default function LibraryGalleryPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Generate array for library_image1.jpg through library_image20.jpg
    const images = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        url: `/library_pics/library_image${i + 1}.jpg`,
        alt: `Library Interior View ${i + 1}`
    }));

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            {/* Navigation Back Button */}
            <Link href="/" passHref>
                <Button
                    variant="outline"
                    radius="md"
                    color="cyan"
                    style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        fontWeight: 600,
                        color: "white",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        borderColor: "rgba(255,255,255,0.6)",
                        zIndex: 500,
                    }}
                >
                    ← Back to Catalog
                </Button>
            </Link>

            <Container size="lg" py="xl" style={{ marginTop: '3rem', width: '100%' }}>
                <Paper
                    withBorder
                    radius="md"
                    p="xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                >
                    <Title
                        order={2}
                        style={{
                            textAlign: "center",
                            color: "white",
                            marginBottom: "2rem",
                            letterSpacing: "1px",
                            textShadow: "0 0 15px rgba(0, 255, 255, 0.3)"
                        }}
                    >
                        Gallery
                    </Title>

                    <Carousel
                        withIndicators
                        classNames={{
                            root: "carousel-root",
                            control: "carousel-control",
                            indicator: "carousel-indicator"
                        }}
                        styles={{
                            control: {
                                background: "rgba(0, 255, 255, 0.2)",
                                color: "white",
                                border: "1px solid rgba(0, 255, 255, 0.5)",
                                backdropFilter: "blur(4px)"
                            },
                            indicator: {
                                backgroundColor: "rgba(255, 255, 255, 0.4)",
                                transition: 'width 250ms ease',
                                '&[data-active]': {
                                    backgroundColor: "cyan",
                                    width: 40
                                }
                            }
                        }}
                    >
                        {images.map((image) => (
                            <Carousel.Slide key={image.id}>
                                <Box p="md">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        radius="md"
                                        fallbackSrc="https://placehold.co/600x400?text=Library+Image"
                                        style={{
                                            height: isMobile ? 300 : 500,
                                            objectFit: "cover",
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                                        }}
                                    />
                                    <Text 
                                        c="dimmed" 
                                        size="sm" 
                                        ta="center" 
                                        mt="sm"
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                    </Text>
                                </Box>
                            </Carousel.Slide>
                        ))}
                    </Carousel>

                    <Box mt={40}>
                        <Title
                            order={3}
                            c="cyan.4"
                            ta="center"
                            mb="lg"
                            style={{ textShadow: "0 0 10px rgba(0, 255, 255, 0.2)" }}
                        >
                            Our Story & Vision
                        </Title>

                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                            <Box>
                                <Text c="white" size="lg" lh={1.6} mb="md">
                                    Our little library was inspired by our community vegetable and perennial gardens. 
                                    We had a vision back in 2023 of beautifying our community by filling an empty green 
                                    space with native plants to attract monarch butterflies and other pollinators.
                                </Text>
                                <Text c="white" size="lg" lh={1.6}>
                                    Since then, our community has come together, cared for the gardens, and watched 
                                    the monarchs arrive and lay eggs on our garden's milkweed.
                                </Text>
                            </Box>

                            <Box 
                                p="md" 
                                style={{ 
                                    borderLeft: isMobile ? "none" : "2px solid rgba(0, 255, 255, 0.3)",
                                    borderTop: isMobile ? "2px solid rgba(0, 255, 255, 0.3)" : "none",
                                    background: "rgba(0, 255, 255, 0.03)" 
                                }}
                            >
                                <Text c="white" size="lg" lh={1.6} mb="md">
                                    We have been collecting eggs, raising butterflies, and tagging them to support 
                                    their conservation in connection with <strong>monarchwatch.org</strong>.
                                </Text>
                                <Text c="cyan.2" size="lg" lh={1.6}>
                                    Our little library displays the miraculous monarch life cycle and provides 
                                    educational resources about our project.
                                </Text>
                            </Box>
                        </SimpleGrid>

                        <Paper 
                            withBorder 
                            p="lg" 
                            mt="xl" 
                            radius="md"
                            style={{ 
                                background: "rgba(255, 255, 255, 0.05)",
                                borderColor: "rgba(0, 255, 255, 0.4)"
                            }}
                        >
                            <Text c="white" ta="center" size="xl" fw={500}>
                                Come take a book and explore our community's love of reading!
                            </Text>
                            <Group justify="center" mt="md">
                                <Link href="/" passHref>
                                    <Button variant="gradient" gradient={{ from: 'cyan', to: 'blue' }} radius="xl">
                                        Browse the Catalog
                                    </Button>
                                </Link>
                            </Group>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
            <Box mt={60} mb={40}>
                <Box 
                        mb={40} 
                        style={{
                            textAlign: 'center',
                            position: 'relative',
                            padding: '2rem',
                            borderRadius: '12px',
                            // A subtle dark gradient behind just the text
                            background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)',
                        }}
                    >
                        <Title
                            order={2}
                            style={{
                                color: "white",
                                fontSize: "clamp(28px, 6vw, 42px)",
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                marginBottom: "0.5rem",
                                // Dual shadow: Black for sharpness, Cyan for themed glow
                                textShadow: `
                                    2px 2px 4px rgba(0,0,0,1),
                                    0 0 20px rgba(0, 255, 255, 0.5)
                                `
                            }}
                        >
                            The Monarch Life Cycle
                        </Title>
                        
                        <Text 
                            size="xl" 
                            fw={500}
                            style={{ 
                                color: "#e0ffff", // Light cyan-white
                                maxWidth: "700px",
                                margin: "0 auto",
                                lineHeight: 1.4,
                                textShadow: "1px 1px 3px rgba(0,0,0,1)",
                                letterSpacing: "0.5px"
                            }}
                        >
                            Witness the transformation we support in our community gardens
                        </Text>

                        {/* Decorative Divider */}
                        <Box 
                            mt="md" 
                            style={{ 
                                height: '2px', 
                                width: '60px', 
                                background: 'cyan', 
                                margin: '0 auto',
                                boxShadow: '0 0 10px cyan' 
                            }} 
                        />
                    </Box>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                    {[
                        { step: 1, label: "Egg"},
                        { step: 2, label: "Larva"},
                        { step: 3, label: "Pupa"},
                        { step: 4, label: "Adult"},
                    ].map((item) => (
                        <Paper
                            key={item.step}
                            withBorder
                            radius="md"
                            p="sm"
                            style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                borderColor: "rgba(0, 255, 255, 0.2)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                transition: "transform 0.2s ease"
                            }}
                            // Subtle hover effect to match your catalog style
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                            <Image
                                src={`/cycle/cycle_${item.step}.jpg`}
                                alt={item.label}
                                radius="md"
                                h={180}
                                fallbackSrc={`https://placehold.co/400x400?text=Stage+${item.step}`}
                                style={{ objectFit: "cover", width: '100%' }}
                            />
                            
                            <Box mt="md" ta="center">
                                <Text fw={700} c="cyan.3" size="lg" style={{ letterSpacing: '1px' }}>
                                    {item.step}. {item.label}
                                </Text>
                            </Box>
                        </Paper>
                    ))}
                </SimpleGrid>
            </Box>
        </div>
    );
}