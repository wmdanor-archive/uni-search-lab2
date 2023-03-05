import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

const NavBar: FC = () => {
  const router = useRouter();

  const isActive = useCallback((pathname: string) => router.pathname === pathname, [router.pathname]);

  return (
    <nav className="border-b">
      <ul className="flex gap-5 p-4">
        <li>
          <Link href='/' data-active={isActive('/')}>Home</Link>
        </li>
        <li>
          <Link href='/paintings/create' data-active={isActive('/paintings/create')}>Create painting record</Link>
        </li>
      </ul>
    </nav>
  );
   
}

export default NavBar;
