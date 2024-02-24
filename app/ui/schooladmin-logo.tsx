import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { lusitana } from '@/app/ui/fonts';

export default function SchoolAdminLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <AccountCircleIcon className="h-12 w-12" />
      <p className="text-[50px]">School Admin</p>
    </div>
  );
}
