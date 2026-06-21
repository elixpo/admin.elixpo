import PixelHero from "@/components/pixel-hero";

export const runtime = "edge";

export default function Home() {
    return (
        <main style={{ background: "#0b0d12", color: "#f5f5f4", minHeight: "100dvh" }}>
            <PixelHero />
        </main>
    );
}
