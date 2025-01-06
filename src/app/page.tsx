import Image from "next/image";
import logoSrc from '@/icon/logo.jpg';
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <figure className="m-auto relative pc:h-[80vh] aspect-[1]">
        <Image priority className="animate-moving w-full h-full object-cover max-w-xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" src={logoSrc} alt="logo"/>
      </figure>
      <Link href='/login'>
        <button 
          className="bg-[#f1b600] py-5 px-10 pl-10 font-bold text-background tracking-widest text-[17px] rounded-[20px] mx-auto block"
        >
          開始
        </button>
      </Link>
    </main>
  );
}
