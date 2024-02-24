// @/app/ui/gogetkids-logo.tsx

import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import { lusitana } from '@/app/ui/fonts';

// Define props interface
interface GoGetKidsLogoProps {
  darkFont?: boolean; // Make darkFont prop optional
}

// Use props interface in component
export default function GoGetKidsLogo({ darkFont }: GoGetKidsLogoProps) {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none`}
      style={{ color: darkFont ? '#333' : 'white' }} // Use darker font color if darkFont is true
    >
      <EscalatorWarningIcon className="h-12 w-12" />
      <p className="text-[44px]">GoGetKids</p>
    </div>
  );
}
