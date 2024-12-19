import { Loader2 } from "lucide-react";
import { InfoSkeleton } from "./Info";
import { ParticipantsSkeleton } from "./Participants";
import { ToolbarSkeleton } from "./Toolbar";
const Loading = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 dark:bg-slate-900 touch-none flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};

export default Loading;
