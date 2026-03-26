import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import { getImageBaseUrl } from "@/utils/imageUtils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Settings2, LayoutDashboard, Cog } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const NAVIGATION_CONFIG = {
  COMMON: {
    EVENTS: {
      title: "Events",
      url: "event",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        // {
        //   title: "QR Scanner",
        //   url: "/event",
        // },
        // {
        //   title: "Event List",
        //   url: "/event-list",
        // },
        // {
        //   title: "Event Track List",
        //   url: "/event-track",
        // },
      ],
    },
    SETTINGS: {
      title: "Settings",
      url: "/settings",
      icon: Cog,
    },
  },
};

const USER_ROLE_PERMISSIONS = {
  1: {
    navMain: ["EVENTS", "SETTINGS"],
    navMainReport: ["EVENTS", "SETTINGS"],
  },

  2: {
    navMain: ["EVENTS", "SETTINGS"],
    navMainReport: ["EVENTS", "SETTINGS"],
  },

  3: {
    navMain: ["EVENTS", "SETTINGS"],
    navMainReport: ["EVENTS", "SETTINGS"],
  },

  4: {
    navMain: ["EVENTS", "SETTINGS"],
    navMainReport: ["EVENTS", "SETTINGS"],
  },
};

const LIMITED_MASTER_SETTINGS = {
  title: "Master Settings",
  url: "#",
  isActive: false,
  icon: Settings2,
  items: [
    {
      title: "Chapters",
      url: "/master/chapter",
    },
  ],
};

const useNavigationData = (userType) => {
  return useMemo(() => {
    const permissions =
      USER_ROLE_PERMISSIONS[userType] || USER_ROLE_PERMISSIONS[1];

    const buildNavItems = (permissionKeys, config, customItems = {}) => {
      return permissionKeys
        .map((key) => {
          if (key === "MASTER_SETTINGS_LIMITED") {
            return LIMITED_MASTER_SETTINGS;
          }
          return config[key];
        })
        .filter(Boolean);
    };

    const navMain = buildNavItems(
      permissions.navMain,
      // { ...NAVIGATION_CONFIG.COMMON, ...NAVIGATION_CONFIG.MODULES },
      { ...NAVIGATION_CONFIG.COMMON },
      // { MASTER_SETTINGS_LIMITED: LIMITED_MASTER_SETTINGS }
    );

    // const navMainReport = buildNavItems(
    //   permissions.navMainReport,
    //   NAVIGATION_CONFIG.REPORTS
    // );

    return { navMain };
  }, [userType]);
};

const Logo = ({ className }) => {
  const companyDetails = useSelector((state) => state.company.companyDetails);
  const companyImage = useSelector((state) => state.company.companyImage);

  const logoBaseUrl =
    getImageBaseUrl(companyImage, "Company") ||
    getImageBaseUrl(companyImage, "No Image");
  const logoUrl =
    logoBaseUrl &&
    (companyDetails?.store_logo_image || companyDetails?.company_logo)
      ? `${logoBaseUrl}${companyDetails.store_logo_image || companyDetails.company_logo}`
      : "/chair-fevicon.png";

  return <img src={logoUrl} alt="Logo" className={className} />;
};

const TEAMS_CONFIG = [
  {
    name: "",
    logo: Logo,
    plan: "",
  },
  {
    name: "Acme Corp.",
    logo: Logo,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Logo,
    plan: "Free",
  },
];

export function AppSidebar({ ...props }) {
  const [openItem, setOpenItem] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { navMain, navMainReport } = useNavigationData(user?.user_type);
  const initialData = {
    user: {
      name: user?.name || "User",
      email: user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: TEAMS_CONFIG,
    navMain,
    navMainReport,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={initialData.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <NavMain
          items={initialData.navMain}
          openItem={openItem}
          setOpenItem={setOpenItem}
        />
        {/* <NavMainReport
          items={initialData.navMainReport}
          openItem={openItem}
          setOpenItem={setOpenItem}
        /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={initialData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

export { NAVIGATION_CONFIG, USER_ROLE_PERMISSIONS };
