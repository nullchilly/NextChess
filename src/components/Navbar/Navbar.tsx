import Link from 'next/link';

const ROUTES = [
  { href: '/random', text: 'Random' },
  { href: '/computer', text: 'Computer' },
  { href: '/minimax', text: 'Minimax' },
];

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex flex-wrap items-center justify-center mx-auto pt-4">
        <Link className="self-center text-2xl font-semibold" href={'/'}>
          Next-Chess
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8 text-center mx-auto pt-2 pb-4">
        {ROUTES.map((route) => (
          <Link
            key={route.href}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href={route.href}>
            {route.text}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
