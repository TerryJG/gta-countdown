import Logo from "@/components/Logo";
import Timer from "@/components/Timer";
import Loader from "@/components/ui/Loader";
import LinkMenu from "@/components/LinkMenu/LinkMenu";
import PlatformButtons from "@/components/GamePlatformButtons";
import { releaseDate } from "@/constants/appInfo";

export default function App() {
  return (
    <div className="font-inter relative grid min-h-screen grid-rows-[1fr_auto] bg-gradient-to-t from-[#111117] to-[#1a1826] px-4 py-4 text-white">
      <main className="flex h-full flex-col items-center justify-center">
        <Logo variant={1} containerClassName="me-6 md:me-18 mb-4 pt-20" logoClassName="px-4 max-h-72 md:max-h-96" />

        <section id="content" className="flex h-full w-full max-w-7xl flex-col items-center justify-center">
          <div id="overview" className="flex w-full flex-col pb-4 text-center">
            <h2 className="text-6xl font-bold tracking-wide text-white uppercase select-none">May 26 2026</h2>
          </div>

          <Timer targetDate={releaseDate.iso} />

          <div id="platform-buttons-container" className="flex h-full w-full flex-col justify-center py-4">
            <PlatformButtons />
          </div>
        </section>
      </main>

      <footer className="flex h-10 items-center justify-center">
        <div className="w-full max-w-7xl px-4">
          <div id="link-menu-container">
            <LinkMenu />
          </div>
        </div>
      </footer>

      <aside id="loader-container" className="fixed right-3 bottom-3 sm:right-4 sm:bottom-4">
        <Loader />
      </aside>
    </div>
  );
}
