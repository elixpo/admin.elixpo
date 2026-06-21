"use client";

import {
    AccountTree,
    Bolt,
    Dns,
    History,
    Hub,
    Logout,
    Public,
    Queue,
    Settings as SettingsIcon,
    Speed,
    Storage,
    ViewList,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { C } from "@/components/ui";

/* Flat, professional analytics theme — solid surfaces, thin borders, no blur. */
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: C.accent },
        background: { default: C.bg, paper: C.panel },
        text: { primary: C.text, secondary: C.textDim },
    },
    typography: { fontFamily: "var(--font-geist-sans), Arial, sans-serif", fontSize: 13 },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    background: C.panel,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    boxShadow: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: "none" } },
        },
    },
});

const navItems = [
    { label: "Overview", icon: Speed, href: "/dashboard" },
    { label: "Traffic", icon: Public, href: "/dashboard/traffic" },
    { label: "Workers", icon: Bolt, href: "/dashboard/workers" },
    { label: "D1", icon: Storage, href: "/dashboard/d1" },
    { label: "KV", icon: ViewList, href: "/dashboard/kv" },
    { label: "Queues", icon: Queue, href: "/dashboard/queues" },
    { label: "Durable Objects", icon: Hub, href: "/dashboard/durable-objects" },
    { label: "Workflows", icon: AccountTree, href: "/dashboard/workflows" },
    { label: "DNS", icon: Dns, href: "/dashboard/dns" },
    { label: "Audit", icon: History, href: "/dashboard/audit" },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard/settings" },
];

export interface ChromeUser {
    email: string;
    name?: string;
}

export default function DashboardChrome({
    user,
    children,
}: {
    user: ChromeUser;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const isActive = (href: string) =>
        href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: "100vh", bgcolor: C.bg }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{ bgcolor: C.bgElev, borderBottom: `1px solid ${C.border}`, backgroundImage: "none" }}
                >
                    <Toolbar variant="dense" sx={{ maxWidth: 1600, width: "100%", mx: "auto", px: { xs: 1.5, md: 2.5 }, minHeight: 52 }}>
                        <Box
                            component={Link}
                            href="/dashboard"
                            sx={{ display: "flex", alignItems: "center", gap: 1.25, textDecoration: "none", mr: 3, flexShrink: 0 }}
                        >
                            <Box sx={{ width: 22, height: 22, borderRadius: "5px", background: `linear-gradient(135deg, ${C.accent} 0%, #7c5cff 100%)` }} />
                            <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: C.text, display: { xs: "none", sm: "block" } }}>
                                Elixpo Admin
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mr: 1, overflowX: "auto" }}>
                            {navItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <IconButton
                                        key={item.href}
                                        component={Link}
                                        href={item.href}
                                        title={item.label}
                                        size="small"
                                        sx={{
                                            color: active ? C.accent : C.textMuted,
                                            bgcolor: active ? C.accentDim : "transparent",
                                            borderRadius: "6px",
                                            width: 32,
                                            height: 32,
                                            "&:hover": { bgcolor: active ? C.accentDim : "rgba(255,255,255,0.05)", color: active ? C.accent : C.text },
                                        }}
                                    >
                                        <item.icon sx={{ fontSize: "1.15rem" }} />
                                    </IconButton>
                                );
                            })}
                        </Box>

                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, #ff8a5b 0%, ${C.accent} 100%)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    color: "#0b0e14",
                                }}
                            >
                                {user.email?.charAt(0).toUpperCase() || "A"}
                            </Box>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            slotProps={{
                                paper: {
                                    sx: { mt: 1, bgcolor: C.panel, border: `1px solid ${C.border}`, borderRadius: "8px", minWidth: 220 },
                                },
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.25 }}>
                                <Typography sx={{ color: C.text, fontWeight: 600, fontSize: "0.85rem" }}>{user.name || "Admin"}</Typography>
                                <Typography sx={{ color: C.textMuted, fontSize: "0.78rem" }}>{user.email}</Typography>
                            </Box>
                            <Divider sx={{ borderColor: C.border }} />
                            <MenuItem
                                component="a"
                                href="/api/auth/logout"
                                sx={{ py: 1, color: C.textDim, "&:hover": { bgcolor: "rgba(239,68,68,0.08)", color: C.error } }}
                            >
                                <ListItemIcon sx={{ color: "inherit", minWidth: 34 }}>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>Logout</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Box component="main" sx={{ maxWidth: 1600, mx: "auto", px: { xs: 1.5, md: 2.5 }, py: 2.5 }}>
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
