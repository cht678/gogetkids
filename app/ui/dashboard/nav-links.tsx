'use client';

import {
  Groups as GroupsIcon,
  Groups2 as Groups2Icon,
  Groups3 as Groups3Icon,
  Home as HomeIcon,
  ClassOutlined as ClassOutlinedIcon,
} from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Classes',
    href: '/dashboard/classes',
    icon: ClassOutlinedIcon,
  },
  {
    name: 'Teachers',
    href: '/dashboard/teachers',
    icon: Groups3Icon,
  },
  {
    name: 'Students',
    href: '/dashboard/students',
    icon: GroupsIcon,
  },
  {
    name: 'Parents',
    href: '/dashboard/parents',
    icon: Groups2Icon,
  },
  {
    name: 'Schedules',
    href: '/dashboard/schedules',
    icon: CalendarMonthIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
