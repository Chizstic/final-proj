import React from 'react';
import Image from 'next/image';
import FacebookLogo from '/public/fb_logo.png';
import Link from 'next/link';

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
        return ""; // Return an empty string instead of null
    }
  };
  const SocialIcons = () => (
    <div className="flex flex-col items-center justify-center mt-4">
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
              className="h-8 w-8 mr-24"
            />
          </a>
        ))}
      </div>
      <div className="w-full flex justify-center -mt-2">
        <div className="w-40 border-t-2 border-slate-400 opacity-30"></div>
      </div>
    </div>
  );

  return (
    <footer className="bg-rose-200 text-gray-800 py-4 mt-56 relative">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <div className="-ml-14">
            <div className="-mt-28 w-48 h-48 rounded-full bg-rose-200 flex justify-center items-center">
              <div className="w-40">
                <Image src="/logo.png" alt="Logo" className="rounded-full" width={160} height={160} />
              </div>
            </div>
          </div>

          <div className="flex justify-center text-lg text-slate-600 w-full">
            <nav className="flex space-x-8">
              <a href="#" className="hover:text-teal-600">About Us</a>
            <Link href="/shop"> <button>shop
               </button>
          </Link>
              <a href="#" className="hover:text-teal-600">Contacts</a>
            </nav>
          </div>
        </div>
        <p className="text-left -ml-14 text-slate-600 text-lg mt-2">224 San Pedro St, Poblacion District,</p>
        <p className="text-left -ml-14 text-slate-600 text-lg">Davao City, 8000 Davao del Sur</p>
        
        <div className="absolute bottom-4 right-4">
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
