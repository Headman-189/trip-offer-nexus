
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface DesktopNavLinksProps {
  isClient: boolean;
  isAgency: boolean;
}

export default function DesktopNavLinks({ isClient, isAgency }: DesktopNavLinksProps) {
  const { t } = useTranslation();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
        end
      >
        Tableau de bord
      </NavLink>

      {isClient && (
        <>
          <NavLink
            to="/my-requests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Mes demandes
          </NavLink>
          <NavLink
            to="/create-request"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Nouvelle demande
          </NavLink>
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Portefeuille
          </NavLink>
        </>
      )}

      {isAgency && (
        <>
          <NavLink
            to="/requests"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Demandes de voyage
          </NavLink>
          <NavLink
            to="/my-offers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Mes offres
          </NavLink>
        </>
      )}
    </div>
  );
}
