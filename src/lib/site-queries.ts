import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const heroQuery = queryOptions({
  queryKey: ["site", "hero"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("hero_section")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const visionMissionQuery = queryOptions({
  queryKey: ["site", "vision_mission"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vision_mission")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const aboutQuery = queryOptions({
  queryKey: ["site", "about"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("about_us")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const activitiesQuery = queryOptions({
  queryKey: ["site", "activities"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["site", "events"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const coursesQuery = queryOptions({
  queryKey: ["site", "courses"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["site", "gallery"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("campus_gallery")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["site", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});
export const staffQuery = queryOptions({
  queryKey: ["site", "staff"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("staff" as any)
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    
    // Casting to unknown first bypasses the strict overlapping type guard cleanly
    return (data as unknown) as Array<{
      id: string;
      name: string;
      group_type: "CEO" | "English courses staff" | "Computer courses staff";
      bio: string;
      image: string | null;
      tags: string[];
      sort_order: number;
    }>;
  },
});