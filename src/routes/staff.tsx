import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { staffQuery } from "@/lib/site-queries";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { cn } from "@/lib/utils";
import { ShieldAlert, Award, GraduationCap, ChevronRight, Crown, Users } from "lucide-react";

export const Route = createFileRoute("/staff")({
  component: PublicStaffPage,
});

type GroupType = "CEO" | "English courses staff" | "Computer courses staff" | "Mentorship";

const CATEGORIES = [
  { id: "CEO" as GroupType, label: "Leadership", icon: Award },
  { id: "English courses staff" as GroupType, label: "English Department", icon: GraduationCap },
  { id: "Computer courses staff" as GroupType, label: "IT & Computing", icon: ChevronRight },
  { id: "Mentorship" as GroupType, label: "Mentorship", icon: Users }, // <-- Added here
];

function PublicStaffPage() {
  const { data: staff = [], isLoading } = useQuery(staffQuery);
  const [activeTab, setActiveTab] = useState<GroupType>("CEO");

  const filteredStaff = staff.filter((member) => member.group_type === activeTab);
  const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeTab)?.label || "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="h-20 md:h-24" />

      <main className="flex-1 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                The Academy Faculty
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                Meet The Faculty Of <br />
                <span className="text-red-600">MEPA.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm">
                Discover the leadership, educators, and academic mentors driving innovation and proficiency at MEPA Academy.
              </p>
            </div>

            <nav className="space-y-2 max-w-sm" aria-label="Departments">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left group",
                      isActive
                        ? "bg-primary/10 text-primary shadow-none"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 shrink-0 transition-transform", 
                      isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <Crown className="h-3.5 w-3.5" />
              <span>{activeCategoryLabel} Team</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-20 border rounded-2xl border-dashed bg-card/50">
                <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">No team members registered in this section.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredStaff.map((member) => (
                  <div 
                    key={member.id} 
                    className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl shadow-muted/40 border bg-card transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="md:col-span-5 h-64 md:h-auto min-h-[260px] bg-muted relative">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover absolute inset-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-muted/30">
                          No Image Available
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-7 bg-[#0b1329] p-8 md:p-10 text-white flex flex-col justify-between min-h-[260px]">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{member.name}</h3>
                        
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
                          {member.group_type === "CEO" ? "Executive Board" : member.group_type}
                        </p>
                        
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 font-normal">
                          {member.bio}
                        </p>
                      </div>

                      {member.tags && member.tags.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-start gap-1.5 flex-wrap">
                          {member.tags.map((tag, idx) => (
                            <span key={idx} className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}