import { AnimatedOutlet } from "../components/layout/AnimatedOutlet";
import { useScrollToTop } from "../hooks/useScrollToTop";

export function PublicAppLayout() {
  useScrollToTop();

  return (
    <div className="min-h-screen w-full flex flex-col font-sans font-kumbh">
      <main className="flex-1 w-full">
        <AnimatedOutlet />
      </main>
    </div>
  );
}

export default PublicAppLayout;
