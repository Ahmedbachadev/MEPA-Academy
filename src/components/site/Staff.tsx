import { useSuspenseQuery } from "@tanstack/react-query";
import { staffQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Staff() {
  const { data: staffMembers } = useSuspenseQuery(staffQuery);

  if (staffMembers.length === 0) return null;

  const groups = [
    { key: "CEO", title: "Leadership" },
    { key: "English courses staff", title: "English Language Faculty" },
    { key: "Computer courses staff", title: "Computer & IT Faculty" },
  ];

  return (
    <section id="staff" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Expert Faculty</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals committed to shaping brilliant career profiles and language mastery.
          </p>
        </div>

        {groups.map((g) => {
          const members = staffMembers.filter((m) => m.group_type === g.key);
          if (members.length === 0) return null;

          return (
            <div key={g.key} className="space-y-6">
              <div className="border-b pb-2">
                <h3 className="text-2xl font-semibold tracking-tight text-primary">{g.title}</h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <Card key={member.id} className="overflow-hidden bg-card transition-all hover:shadow-md">
                    <div className="aspect-square w-full relative bg-muted">
                      {member.image ? (
                        <img
                          src={resolveImage(member.image)}
                          alt={member.name}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                          No Profile Photo
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div>
                        <h4 className="font-bold text-lg leading-snug">{member.name}</h4>
                        <p className="text-xs text-primary font-medium tracking-wide uppercase mt-0.5">{g.key === "CEO" ? "Executive Office" : "Instructor"}</p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                      {member.tags && member.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {member.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-[11px] font-normal px-2">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}