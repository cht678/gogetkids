import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { lusitana } from '@/app/ui/fonts';

export default function TransportAdminLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <DirectionsBusIcon className="h-12 w-12" />
      <p className="text-[35px]">Transport Admin</p>
    </div>
  );
}
