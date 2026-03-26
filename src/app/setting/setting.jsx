import Logout from "@/components/auth/log-out";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import useAppLogout from "@/utils/logout";
import { LogOut } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const handleLogout = useAppLogout();

  return (
    <div className="p-2  mx-auto ">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Appearance
          </h3>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Theme Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {["default", "yellow", "green", "purple", "teal", "gray"].map(
                (color) => {
                  const colorsMap = {
                    default: "bg-yellow-500",
                    yellow: "bg-orange-500",
                    green: "bg-green-600",
                    purple: "bg-purple-600",
                    teal: "bg-teal-600",
                    gray: "bg-gray-600",
                  };
                  const isActive = theme === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setTheme(color)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                                            ${colorsMap[color]} 
                                            ${
                                              isActive
                                                ? "shadow-lg ring-2 ring-offset-2 ring-primary scale-110"
                                                : "opacity-80 hover:opacity-100 hover:scale-105"
                                            }`}
                      title={`Set ${color} theme`}
                    >
                      {isActive && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                },
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Current theme:{" "}
              <span className="font-medium capitalize">{theme}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Account Security
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Safely sign out of your account and clear your session.
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <Logout
        open={isLogoutDialogOpen}
        setOpen={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Settings;
