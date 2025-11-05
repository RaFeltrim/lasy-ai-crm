"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LeadFilterSchema,
  LeadStatus,
  type LeadFilter,
} from "@/lib/zod-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export function FiltersBar() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<LeadFilter>({
      resolver: zodResolver(LeadFilterSchema),
      defaultValues: {
        query: "",
        status: undefined,
        source: "",
        from: "",
        to: "",
      },
    });

  const statusValue = watch("status");

  // Sync form with URL params only on client
  useEffect(() => {
    setIsClient(true);

    const query = searchParams.get("query") || "";
    const status = (searchParams.get("status") as LeadStatus) || undefined;
    const source = searchParams.get("source") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    reset({ query, status, source, from, to });
  }, [searchParams, reset]);

  const onSubmit = (data: LeadFilter) => {
    if (!isClient) return;

    const params = new URLSearchParams();

    if (data.query) params.set("query", data.query);
    if (data.status) params.set("status", data.status);
    if (data.source) params.set("source", data.source);
    if (data.from) params.set("from", data.from);
    if (data.to) params.set("to", data.to);

    const queryString = params.toString();
    router.replace(queryString ? `/dashboard?${queryString}` : "/dashboard");
  };

  const handleClear = () => {
    if (!isClient) return;

    reset({
      query: "",
      status: undefined,
      source: "",
      from: "",
      to: "",
    });
    router.replace("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      suppressHydrationWarning
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Search by name, email, company, or notes..."
          {...register("query")}
          className="sm:col-span-2 lg:col-span-2"
          suppressHydrationWarning
        />

        <Select
          value={statusValue || ""}
          onValueChange={(value) => setValue("status", value as LeadStatus)}
        >
          <SelectTrigger suppressHydrationWarning>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Source"
          {...register("source")}
          suppressHydrationWarning
        />

        <Input
          type="date"
          placeholder="From"
          {...register("from")}
          suppressHydrationWarning
        />

        <Input
          type="date"
          placeholder="To"
          {...register("to")}
          suppressHydrationWarning
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </form>
  );
}
