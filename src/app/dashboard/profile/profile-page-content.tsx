"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Shield, Calendar, Clock, Camera, Phone,
  Save, Loader2, CheckCircle2, AlertTriangle, LogOut,
  Bell, BellOff, Monitor, Lock, KeyRound
} from "lucide-react";
import { updateProfileAction, changePasswordAction } from "@/app/dashboard/profile/actions";
import { logoutAction } from "@/app/admin/actions";
import { STRONG_PASSWORD_HINT, validatePasswordAgainstPolicy } from "@/lib/auth/password-policy";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/components/ui/password-input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";

/* ────────────────────────────────────────── types ── */

type ProfileData = {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string | null;
  lastSignIn: string | null;
};

type FormResult = { success: boolean; message: string } | null;

/* ────────────────────────────────────── helpers ── */

function initials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.charAt(0).toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ────────────────────────────────────── feedback ── */

function FeedbackBanner({ result }: { result: FormResult }) {
  if (!result) return null;
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
        result.success
          ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
          : "border-red-500/20 bg-red-500/8 text-red-400"
      }`}
    >
      {result.success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p>{result.message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

export function ProfilePageContent({
  profile,
  requireStrongPasswords
}: {
  profile: ProfileData;
  requireStrongPasswords: boolean;
}) {
  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-6">
        {/* ── Header ── */}
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Account</p>
          <h1 className="text-3xl font-semibold">Profile</h1>
        </RevealItem>

        {/* ── Tabs ── */}
        <RevealItem>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab profile={profile} />
            </TabsContent>
            <TabsContent value="edit">
              <EditProfileTab profile={profile} />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab profile={profile} requireStrongPasswords={requireStrongPasswords} />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 1 — OVERVIEW
   ═══════════════════════════════════════════════════ */

function OverviewTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* ── Identity card ── */}
      <Card className="lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Avatar className="h-24 w-24 border-2 border-accentA/20">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName ?? profile.email} />
            ) : null}
            <AvatarFallback className="bg-accent-gradient text-2xl font-bold text-ivory">
              {initials(profile.displayName, profile.email)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {profile.displayName || profile.email.split("@")[0]}
            </p>
            <p className="mt-0.5 text-sm text-fg/50">{profile.email}</p>
          </div>
          <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="capitalize">
            {profile.role}
          </Badge>
        </CardContent>
      </Card>

      {/* ── Details card ── */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
          <CardDescription>Your account information at a glance</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile.email} />
          <DetailRow icon={<Shield className="h-4 w-4" />} label="Role" value={profile.role} capitalize />
          <DetailRow icon={<Calendar className="h-4 w-4" />} label="Joined" value={formatDate(profile.createdAt)} />
          <DetailRow icon={<Clock className="h-4 w-4" />} label="Last Sign-In" value={formatDateTime(profile.lastSignIn)} />
          {profile.phone ? (
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={profile.phone} />
          ) : null}
          <DetailRow icon={<KeyRound className="h-4 w-4" />} label="Auth Method" value="Email / Password" />
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  capitalize
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/12 bg-card/40 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accentA/10 text-accentA">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fg/48">{label}</p>
        <p className={`truncate text-sm font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 2 — EDIT PROFILE
   ═══════════════════════════════════════════════════ */

function EditProfileTab({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormResult>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  async function handleAvatarUpload(file: File) {
    if (avatarUploading) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 4 * 1024 * 1024) {
      setResult({ success: false, message: "Avatar image must be under 4MB." });
      return;
    }
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData, credentials: "include" });
      const payload = (await res.json()) as { url?: string; message?: string };
      if (res.ok && payload.url) {
        setAvatarUrl(payload.url);
      } else {
        setResult({ success: false, message: payload.message || "Avatar upload failed." });
      }
    } catch {
      setResult({ success: false, message: "Avatar upload failed." });
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(event.currentTarget);
    formData.set("avatar_url", avatarUrl);
    try {
      const response = await updateProfileAction(formData);
      setResult(response);
      if (response.success) {
        router.refresh();
      }
    } catch {
      setResult({ success: false, message: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-border/18">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-accent-gradient text-xl font-bold text-ivory">
                  {initials(profile.displayName, profile.email)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Upload avatar"
              >
                {avatarUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                  e.currentTarget.value = "";
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Profile Photo</p>
              <p className="text-xs text-fg/48">Click the avatar to upload. Max 4MB.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldGroup label="Display Name" htmlFor="display_name">
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile.displayName ?? ""}
                placeholder="Your name"
                className="h-11 rounded-xl border-border/18 bg-bg/50 px-4 text-sm"
              />
            </FieldGroup>
            <FieldGroup label="Phone" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone ?? ""}
                placeholder="+1 (555) 000-0000"
                className="h-11 rounded-xl border-border/18 bg-bg/50 px-4 text-sm"
              />
            </FieldGroup>
          </div>

          <FeedbackBanner result={result} />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="h-10 gap-2 rounded-xl px-6 text-sm font-medium">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 3 — SECURITY
   ═══════════════════════════════════════════════════ */

function SecurityTab({ profile, requireStrongPasswords }: { profile: ProfileData; requireStrongPasswords: boolean }) {
  return (
    <div className="space-y-5">
      <ChangePasswordCard requireStrongPasswords={requireStrongPasswords} />
      <SessionCard profile={profile} />
    </div>
  );
}

function ChangePasswordCard({ requireStrongPasswords }: { requireStrongPasswords: boolean }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormResult>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("new_password") || "");
    const validationError = validatePasswordAgainstPolicy(newPassword, { requireStrongPasswords });
    if (validationError) {
      setResult({ success: false, message: validationError });
      setLoading(false);
      return;
    }
    try {
      const response = await changePasswordAction(formData);
      setResult(response);
      if (response.success) {
        (event.target as HTMLFormElement).reset();
      }
    } catch {
      setResult({ success: false, message: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-fg/60" />
          Change Password
        </CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldGroup label="Current Password" htmlFor="current_password">
            <PasswordInput id="current_password" name="current_password" required placeholder="••••••••" />
          </FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldGroup label="New Password" htmlFor="new_password">
              <PasswordInput id="new_password" name="new_password" required placeholder="••••••••" />
            </FieldGroup>
            <FieldGroup label="Confirm New Password" htmlFor="confirm_password">
              <PasswordInput id="confirm_password" name="confirm_password" required placeholder="••••••••" />
            </FieldGroup>
          </div>
          <p className="text-xs text-fg/42">
            {requireStrongPasswords ? STRONG_PASSWORD_HINT : "Minimum 8 characters. Choose something strong and unique."}
          </p>
          <FeedbackBanner result={result} />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="h-10 gap-2 rounded-xl px-6 text-sm font-medium">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SessionCard({ profile }: { profile: ProfileData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-fg/60" />
          Session
        </CardTitle>
        <CardDescription>Your current session information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/12 bg-card/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm font-medium">Active Session</p>
              <p className="text-xs text-fg/48">{profile.email}</p>
            </div>
          </div>
          <p className="text-xs text-fg/42">
            Last: {formatDateTime(profile.lastSignIn)}
          </p>
        </div>

        {/* ── Sign Out / Danger Zone ── */}
        <div className="rounded-xl border border-red-500/15 bg-red-500/4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-400">Sign Out</p>
              <p className="text-xs text-fg/48">End your current session on this device.</p>
            </div>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                className="gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 4 — SETTINGS
   ═══════════════════════════════════════════════════ */

function SettingsTab() {
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("graphxify-notifications");
    return stored !== "disabled";
  });

  function toggleNotifications() {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem("graphxify-notifications", next ? "enabled" : "disabled");
  }

  return (
    <div className="space-y-5">
      {/* ── Appearance ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>Customize how the CMS looks for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-border/12 bg-card/40 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-fg/48">Toggle between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* ── Notifications ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            icon={notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            label="Browser Notifications"
            description="Receive notifications for content updates"
            checked={notifications}
            onToggle={toggleNotifications}
          />
        </CardContent>
      </Card>

      {/* ── CMS Preferences ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CMS Preferences</CardTitle>
          <CardDescription>Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <PreferenceRow label="Default Content View" value="Grid" />
          <PreferenceRow label="Items Per Page" value="20" />
          <PreferenceRow label="Time Zone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
          <PreferenceRow label="Language" value="English" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────────────────────── shared UI ── */

function FieldGroup({
  label,
  htmlFor,
  children
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-[0.1em] text-fg/56">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onToggle
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/12 bg-card/40 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accentA/10 text-accentA">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-fg/48">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          checked ? "bg-accentA" : "border border-border/30 bg-card/60"
        }`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/12 bg-card/40 px-4 py-3">
      <p className="text-sm text-fg/72">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
