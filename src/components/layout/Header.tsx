import { HeaderBranding } from "./HeaderBranding";
import { HeaderContent } from "./HeaderContent";

export const Header = () => {
  return (
    <div className="flex w-full bg-slate-100 shadow-sm border-b border-white">
      <HeaderBranding />
      <HeaderContent />
    </div>
  );
};
