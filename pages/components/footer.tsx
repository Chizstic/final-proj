import React from "react";
import Image from "next/image";
import FacebookLogo from "/public/fb_logo.png";

function Footer() {
  const Icons = [
    {
      name: "logo-facebook",
      link: "https://www.facebook.com/guysngalsilustre/",
    },
  ];

  const getLogo = (name: string) => {
    switch (name) {
      case "logo-facebook":
        return FacebookLogo;
      default:
        return "";
    }
  };

  const SocialIcons = () => (
    <div className="hidden sm:hidden md:flex flex-col items-center justify-center mt-4">
      {/* Fading Top Line */}
      <div className="w-full flex justify-center -mb-1">
        <div className="w-40 border-t-2 border-slate-400 opacity-30"></div>
      </div>
      {/* Facebook Logo */}
      <div className="mb-2">
        {Icons.map((icon) => (
          <a
            key={icon.name}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 cursor-pointer inline-flex items-center rounded-full text-xl hover:text-gray-100 duration-300"
          >
            <Image
              src={getLogo(icon.name)}
              alt={icon.name}
              className="h-8 w-8"
            />
          </a>
        ))}
      </div>
      {/* Fading Bottom Line */}
      <div className="w-full flex justify-center -mt-2">
        <div className="w-40 border-t-2 border-slate-400 opacity-30"></div>
      </div>
    </div>
  );

  return (
    <footer className="bg-rose-200 text-gray-800 py-4 mt-56 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="-ml-14 sm:ml-0">
            <div className="-mt-28 w-48 h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-rose-200 flex justify-center items-center">
  <div className="w-40 sm:w-32 md:w-40">
    <Image
      src="/logo.png"
      alt="Logo"
      className="rounded-full"
      width={160}
      height={160}
    />
  </div>
</div>

            </div>
          </div>

          {/* Navigation Links */}
          <div className=" sm:flex sm:text-sm sm:ml-4 md:flex md:text-lg lg:text-lg justify-center text-slate-600 w-full">
            <nav className="flex space-x-8">
              <a href="#" className="hover:text-teal-600 ">
                About Us
              </a>
              <a href="#" className="hover:text-teal-600">
                Contacts
              </a>
            </nav>
          </div>
        </div>

      {/* Address Section */}
      <div className="text-left mt-2 -ml-14 sm:-ml-0 sm:text-sm md:text-lg lg:text-lg">
        <p className="text-slate-600 ">
          224 San Pedro St, Poblacion District,
        </p>
        <p className="text-slate-600">Davao City, 8000 Davao del Sur</p>
      </div>

        {/* Social Icons Section */}
        <div className="absolute bottom-4 right-4">
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}

export default Footer;