import Image from "next/image";
import logoSrc from '@/icon/logo.jpg';
import LoginButton from "@/components/pages/app/button";

export default function Home() {
  return (
    <main>
      <figure className="m-auto relative pc:h-[80vh] aspect-[1]">
        <Image
          priority
          className="animate-moving w-full h-full object-cover max-w-xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          src={logoSrc} 
          alt="logo"
        />
      </figure>
      <LoginButton/>
    </main>
  );
}
