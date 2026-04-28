import React from "react";
import Image from "next/image";

function Footer() {
  const icons = [
    {
      name: "logo-facebook",
      link: "https://www.facebook.com/guysngalsilustre/",
    },
  ];

  const getLogo = (name: string) => {
    switch (name) {
      case "logo-facebook":
        return "/fb_logo.png";
      default:
        return "";
    }
  };

  const SocialIcons = () => (
    <div className="flex flex-col items-start gap-3 md:items-end">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
        Follow Us
      </span>
      <div className="flex items-center gap-3">
        {icons.map((icon) => (
          <a
            key={icon.name}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.name}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-300 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50"
          >
            <Image
              src={getLogo(icon.name)}
              alt={icon.name}
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="mt-40 border-t border-rose-300/70 bg-rose-200 text-gray-800">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70 bg-rose-100 shadow-md shadow-rose-300/40 sm:h-28 sm:w-28">
              <Image
                src="/logo.png"
                alt="Logo"
                className="rounded-full"
                width={88}
                height={88}
              />
            </div>

            <div className="space-y-2 text-left">
              <div>
                <h2 className="text-xl font-bold text-rose-700 sm:text-2xl">
                  Guys & Gals Salon
                </h2>
                <p className="text-sm text-slate-600 sm:text-base">
                  Relaxed beauty care with a warm, polished touch.
                </p>
              </div>

              <div className="space-y-1 text-sm text-slate-600 sm:text-base">
                <p>224 San Pedro St, Poblacion District,</p>
                <p>Davao City, 8000 Davao del Sur</p>
              </div>
            </div>
          </div>

          <div className="md:self-end">
            <SocialIcons />
          </div>
        </div>

        <div className="mt-8 border-t border-rose-300/70 pt-4 text-center text-xs text-slate-500 sm:text-sm">
          <p>(c) 2026 Guys & Gals Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
