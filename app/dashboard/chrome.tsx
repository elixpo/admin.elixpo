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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import BackgroundAurora from "@/components/background-aurora";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#9b7bf7" },
        background: { default: "transparent", paper: "rgba(255, 255, 255, 0.03)" },
    },
    typography: { fontFamily: "var(--font-geist-sans), Arial, sans-serif" },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    backgroundImage: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                },
            },
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
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ position: "relative", minHeight: "100vh" }}>
                <BackgroundAurora variant="default" />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{
                            bgcolor: "rgba(11, 13, 18, 0.4)",
                            backdropFilter: "blur(16px)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                            backgroundImage: "none",
                        }}
                    >
                        <Toolbar sx={{ maxWidth: "1400px", width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
                            <Box
                                component={Link}
                                href="/dashboard"
                                sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", mr: 3, flexShrink: 0 }}
                            >
                                <Box
                                    sx={{
                                        height: 30,
                                        width: 30,
                                        borderRadius: "8px",
                                        background: "linear-gradient(135deg, #ff8a5b 0%, #9b7bf7 100%)",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        color: "#f5f5f4",
                                        display: { xs: "none", sm: "block" },
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Elixpo Admin
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, overflowX: "auto" }}>
                                {navItems.map((item) => (
                                    <IconButton
                                        key={item.href}
                                        component={Link}
                                        href={item.href}
                                        title={item.label}
                                        sx={{
                                            color: isActive(item.href) ? "#9b7bf7" : "rgba(255, 255, 255, 0.45)",
                                            bgcolor: isActive(item.href) ? "rgba(155, 123, 247, 0.1)" : "transparent",
                                            borderRadius: "8px",
                                            width: 38,
                                            height: 38,
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                bgcolor: isActive(item.href)
                                                    ? "rgba(155, 123, 247, 0.15)"
                                                    : "rgba(255, 255, 255, 0.06)",
                                                color: isActive(item.href) ? "#9b7bf7" : "rgba(255, 255, 255, 0.8)",
                                            },
                                        }}
                                    >
                                        <item.icon sx={{ fontSize: "1.25rem" }} />
                                    </IconButton>
                                ))}
                            </Box>

                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #ff8a5b 0%, #9b7bf7 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.95rem",
                                        fontWeight: 700,
                                        color: "#161816",
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
                                        sx: {
                                            mt: 1,
                                            bgcolor: "rgba(20, 24, 18, 0.95)",
                                            backdropFilter: "blur(16px)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "12px",
                                            minWidth: 220,
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                        },
                                    },
                                }}
                            >
                                <Box sx={{ px: 2, py: 1.5 }}>
                                    <Typography sx={{ color: "#f5f5f4", fontWeight: 600, fontSize: "0.9rem" }}>
                                        {user.name || "Admin"}
                                    </Typography>
                                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                                <MenuItem
                                    component="a"
                                    href="/api/auth/logout"
                                    sx={{
                                        py: 1.25,
                                        color: "rgba(255,255,255,0.5)",
                                        "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)", color: "#ef4444" },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ fontSize: "0.875rem" }}>
                                        Logout
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>

                    <Box component="main" sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, md: 3 }, py: 3 }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
