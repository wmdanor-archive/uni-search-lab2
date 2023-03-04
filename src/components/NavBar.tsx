import Link from "next/link";
import { FC } from "react";

const NavBar: FC = () => {
  return <nav>
    <ul className="flex gap-5 p-4">
      <li>
        <Link href='/'>Home</Link>
      </li>
      <li>
        <Link href='/paintings/create'>Create painting record</Link>
      </li>
    </ul>
  </nav>
}

export default NavBar;
