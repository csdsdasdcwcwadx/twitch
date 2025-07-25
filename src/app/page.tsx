import Image from "next/image";
import headSrc from '@/icon/head.gif';
import LoginButton from "@/components/pages/app/button";

export default function Home() {
  return (
    <main>
      <figure className="m-auto relative pc:h-[80vh] aspect-[1]">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-xl">
          <Image
            priority
            className="w-full h-full object-contain"
            src={headSrc} 
            alt="logo"
          />
        </div>
      </figure>
      <LoginButton/>
    </main>
  );
}
