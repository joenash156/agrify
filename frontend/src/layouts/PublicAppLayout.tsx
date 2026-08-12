import { Outlet } from "react-router-dom";

export function PublicAppLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col font-sans font-kumbh">
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicAppLayout;
