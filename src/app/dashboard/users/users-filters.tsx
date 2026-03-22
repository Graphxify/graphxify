"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsersFiltersProps = {
  roleOptions: { id: string | number; slug: string; name: string }[];
  initialSearch: string;
  initialRole: string;
  initialStatus: string;
  initialLastLogin: string;
  initialCreatedWithin: string;
};

export function UsersFilters({
  roleOptions,
  initialSearch,
  initialRole,
  initialStatus,
  initialLastLogin,
  initialCreatedWithin
}: UsersFiltersProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [lastLogin, setLastLogin] = useState(initialLastLogin);
  const [createdWithin, setCreatedWithin] = useState(initialCreatedWithin);

  useEffect(() => {
    setSearch(initialSearch);
    setRole(initialRole);
    setStatus(initialStatus);
    setLastLogin(initialLastLogin);
    setCreatedWithin(initialCreatedWithin);
  }, [initialSearch, initialRole, initialStatus, initialLastLogin, initialCreatedWithin]);

  const currentQuery = useMemo(() => searchParams.toString(), [searchParams]);

  function pushFilters(nextValues: {
    search?: string;
    role?: string;
    status?: string;
    lastLogin?: string;
    createdWithin?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const nextSearch = nextValues.search ?? search;
    const nextRole = nextValues.role ?? role;
    const nextStatus = nextValues.status ?? status;
    const nextLastLogin = nextValues.lastLogin ?? lastLogin;
    const nextCreatedWithin = nextValues.createdWithin ?? createdWithin;

    if (nextSearch.trim()) params.set("q", nextSearch.trim());
    else params.delete("q");

    if (nextRole) params.set("role", nextRole);
    else params.delete("role");

    if (nextStatus) params.set("status", nextStatus);
    else params.delete("status");

    if (nextLastLogin) params.set("lastLogin", nextLastLogin);
    else params.delete("lastLogin");

    if (nextCreatedWithin) params.set("createdWithin", nextCreatedWithin);
    else params.delete("createdWithin");

    params.delete("page");

    const nextQuery = params.toString();
    if (nextQuery === currentQuery) {
      return;
    }

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      pushFilters({ search });
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/14 bg-card/60 px-4 py-3 backdrop-blur">
      <div className="relative min-w-[260px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/36" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="h-9 pl-9 pr-9"
        />
        {isPending ? (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-fg/36" />
        ) : null}
      </div>

      <select
        value={role}
        onChange={(event) => {
          const value = event.target.value;
          setRole(value);
          pushFilters({ role: value });
        }}
        className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
      >
        <option value="">All roles</option>
        {roleOptions.map((roleOption) => (
          <option key={roleOption.id} value={roleOption.slug}>
            {roleOption.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => {
          const value = event.target.value;
          setStatus(value);
          pushFilters({ status: value });
        }}
        className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="disabled">Disabled</option>
        <option value="pending_invite">Pending</option>
      </select>

      <select
        value={lastLogin}
        onChange={(event) => {
          const value = event.target.value;
          setLastLogin(value);
          pushFilters({ lastLogin: value });
        }}
        className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
      >
        <option value="">Login: any</option>
        <option value="7d">Last 7d</option>
        <option value="30d">Last 30d</option>
        <option value="90d">Last 90d</option>
        <option value="never">Never</option>
      </select>

      <select
        value={createdWithin}
        onChange={(event) => {
          const value = event.target.value;
          setCreatedWithin(value);
          pushFilters({ createdWithin: value });
        }}
        className="h-9 rounded-md border border-border/20 bg-card/72 px-2 text-xs text-fg"
      >
        <option value="">Created: any</option>
        <option value="7d">7d</option>
        <option value="30d">30d</option>
        <option value="90d">90d</option>
        <option value="365d">1y</option>
      </select>

      <Button asChild type="button" variant="ghost" size="sm" className="h-9">
        <Link href="/dashboard/users">Clear</Link>
      </Button>
    </div>
  );
}
