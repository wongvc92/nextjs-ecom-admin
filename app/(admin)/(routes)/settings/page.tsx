import { auth } from "@/auth";
import UserInfo from "@/components/auth/user-info";
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <>
      {session && session.user && (
        <div className="max-w-md mx-auto ">
          <div className="px-4 space-y-4">
            <p className="text-center">Settings</p>
            <SettingsForm session={session} />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;
