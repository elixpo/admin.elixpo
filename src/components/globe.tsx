"use client";

/** Cloudflare-style rotating globe (cobe / WebGL) with request markers per
 * country. Purely decorative + informative; degrades to nothing if WebGL fails. */

import { CENTROIDS } from "@/components/country-centroids";
import type { Dim } from "@/lib/metrics";
import { Box } from "@mui/material";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe({
    country,
    size = 340,
}: { country: Dim[]; size?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const max = Math.max(...country.map((c) => c.count), 1);
        const markers = country
            .map((c) => {
                const loc = CENTROIDS[c.label];
                if (!loc) return null;
                return { location: loc, size: 0.03 + (c.count / max) * 0.09 };
            })
            .filter(Boolean) as { location: [number, number]; size: number }[];

        let phi = 0;
        let raf = 0;
        let globe: {
            update: (s: { phi: number }) => void;
            destroy: () => void;
        } | null = null;
        try {
            globe = createGlobe(canvas, {
                devicePixelRatio: 2,
                width: size * 2,
                height: size * 2,
                phi: 0,
                theta: 0.25,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 5,
                baseColor: [0.28, 0.26, 0.38],
                markerColor: [0.61, 0.48, 0.97],
                glowColor: [0.36, 0.26, 0.6],
                markers,
            });
            const tick = () => {
                phi += 0.004;
                globe?.update({ phi });
                raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        } catch {
            // WebGL unavailable — leave the canvas blank.
        }
        return () => {
            cancelAnimationFrame(raf);
            globe?.destroy();
        };
    }, [country, size]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: size,
                    height: size,
                    maxWidth: "100%",
                    aspectRatio: "1",
                }}
            />
        </Box>
    );
}
