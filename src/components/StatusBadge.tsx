export const StatusBadge = ({ status }: { status: "valid" | "used" | "invalid" }) => {
  const styles = {
    valid: "bg-accent/10 text-accent",
    used: "bg-muted text-muted-foreground",
    invalid: "bg-destructive/10 text-destructive",
  };

  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};
