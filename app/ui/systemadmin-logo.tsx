import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { lusitana } from '@/app/ui/fonts';

export default function SystemAdminLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AdminPanelSettingsIcon className="h-12 w-12" />
      <p className="text-[50px]">System Admin</p>
    </div>
  );
}
