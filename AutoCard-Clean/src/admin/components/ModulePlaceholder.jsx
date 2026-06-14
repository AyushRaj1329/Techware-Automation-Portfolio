import { Construction } from "lucide-react";

// Generic placeholder shown for modules whose behavior hasn't been defined yet.
const ModulePlaceholder = ({ icon: Icon, title, description }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {Icon ? <Icon className="h-6 w-6 text-primary" /> : null}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-background p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Construction className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="font-display text-lg font-semibold mb-1">Module ready for development</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This module is scaffolded and routed. Share the requirements for{" "}
          <span className="font-medium text-foreground">{title}</span> and it will be built out here.
        </p>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
