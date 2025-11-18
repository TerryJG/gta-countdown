import Logo from "@/components/Logo";
import Timer from "@/components/Timer";
import Loader from "@/components/ui/Loader";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import PlatformButtons from "@/components/GamePlatformButtons";
import { releaseDate } from "@/constants/appInfo";

export default function App() {
  return (
    <main className="font-inter relative flex h-dvh flex-col overflow-hidden bg-linear-to-t from-[#111117] to-[#1a1826] px-4 text-white">
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
        <Logo variant={1} containerClassName="me-6 md:me-18 flex-shrink-0" logoClassName="px-4 max-h-48 md:max-h-78" />

        <div id="overview" className="flex w-full max-w-7xl shrink-0 flex-col text-center">
          <h2 className="text-6xl font-bold tracking-wide text-white uppercase select-none">{releaseDate.string.replaceAll(",", "")}</h2>
        </div>

        <Timer targetDate={releaseDate.iso} />
      </section>

      <section className="flex flex-col">
        <div id="platform-buttons-container" className="flex items-center justify-center">
          <PlatformButtons />
        </div>

        <footer className="flex items-center justify-center py-4">
          <div className="w-full max-w-7xl px-4">
            <div id="link-menu-container">
              <NavigationBar />
            </div>
          </div>
        </footer>
      </section>

      <aside id="loader-container" className="fixed right-3 bottom-3 sm:right-4 sm:bottom-4">
        <Loader />
      </aside>
    </main>
  );
}
