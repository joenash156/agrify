"use client";

import { Component, type ReactNode } from "react";
import LottieRaw from "lottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faDesktop,
  faHouse,
  faBook,
  faInfoCircle,
  faGlobe,
  faMagnifyingGlass,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import HomeAnimated from "../../assets/icons/animated/home.json";
import AboutAnimated from "../../assets/icons/animated/about.json";
import BlogAnimated from "../../assets/icons/animated/blog.json";
import LanguageAnimated from "../../assets/icons/animated/language.json";
import SunAnimated from "../../assets/icons/animated/sun.json";
import MoonAnimated from "../../assets/icons/animated/moon.json";
import SystemAnimated from "../../assets/icons/animated/system.json";
import SearchAnimated from "../../assets/icons/animated/search.json";
import LoginAnimated from "../../assets/icons/animated/login.json";

// Safe ESM/CJS interop for Lottie component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LottieComponent: any =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof LottieRaw === "function" ? LottieRaw : (LottieRaw as any)?.default || LottieRaw;

type IconProps = {
  width?: number;
  height?: number;
};

// Error boundary to catch any runtime Lottie render failures and render fallbacks smoothly
class IconErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SafeLottie({
  animationData,
  width = 20,
  height = 20,
  fallback,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any;
  width?: number;
  height?: number;
  fallback: ReactNode;
}) {
  if (!LottieComponent || typeof LottieComponent !== "function") {
    return <>{fallback}</>;
  }

  return (
    <IconErrorBoundary fallback={fallback}>
      <div style={{ width, height }} className="inline-flex items-center justify-center shrink-0">
        <LottieComponent
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width, height }}
        />
      </div>
    </IconErrorBoundary>
  );
}

export function HomeIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={HomeAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faHouse} className="text-teal-600" style={{ width, height }} />}
    />
  );
}

export function BlogIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={BlogAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faBook} className="text-teal-600" style={{ width, height }} />}
    />
  );
}

export function AboutIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={AboutAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faInfoCircle} className="text-teal-600" style={{ width, height }} />}
    />
  );
}

export function LanguageIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={LanguageAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faGlobe} className="text-teal-600" style={{ width, height }} />}
    />
  );
}

export function SunIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={SunAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faSun} className="text-amber-500" style={{ width, height }} />}
    />
  );
}

export function MoonIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={MoonAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faMoon} className="text-teal-400" style={{ width, height }} />}
    />
  );
}

export function SystemIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={SystemAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faDesktop} className="text-zinc-400" style={{ width, height }} />}
    />
  );
}

export function SearchIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={SearchAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-zinc-400" style={{ width, height }} />}
    />
  );
}

export function LoginIcon({ width = 20, height = 20 }: IconProps) {
  return (
    <SafeLottie
      animationData={LoginAnimated}
      width={width}
      height={height}
      fallback={<FontAwesomeIcon icon={faRightToBracket} className="text-teal-600" style={{ width, height }} />}
    />
  );
}