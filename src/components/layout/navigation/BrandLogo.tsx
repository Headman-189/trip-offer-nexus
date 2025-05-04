
import { NavLink } from "react-router-dom";

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <NavLink to="/dashboard" className={`flex items-center ${className || ''}`}>
      <span className="text-xl font-semibold text-brand-800">
        TripOfferNexus
      </span>
    </NavLink>
  );
}
