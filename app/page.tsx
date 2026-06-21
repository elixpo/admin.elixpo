import LandingSections from "@/components/landing-sections";
import PixelHero from "@/components/pixel-hero";

export const runtime = "edge";

export default function Home() {
    return (
        <main
            style={{
                background:
                    "linear-gradient(180deg, #0b0d12 0%, #11151c 50%, #0b0d12 100%)",
                color: "#f5f5f4",
                minHeight: "100dvh",
            }}
        >
            <PixelHero />
            <LandingSections />
        </main>
    );
}
