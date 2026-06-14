import { Link } from "react-router-dom";
import { customerModules } from "../modules.js";

const Overview = () => {
  // Exclude the overview entry itself from the module grid.
  const modules = customerModules.filter((m) => m.key !== "overview");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold">Customer Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Select a module to get started.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map(({ key, label, path, icon: Icon, description }) => (
          <Link
            key={key}
            to={path}
            className="group rounded-2xl bg-background border border-border p-6 card-shadow hover:card-shadow-hover hover:border-primary/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5.5 w-5.5 text-primary" />
            </div>
            <h3 className="font-display font-semibold mb-1">{label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Overview;
