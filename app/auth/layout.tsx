import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* LEFT - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden text-white">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-900" />

        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-purple-400 blur-3xl" />
          <div className="absolute bottom-[10%] -right-[10%] w-[60vh] h-[60vh] rounded-full bg-indigo-400 blur-3xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-8 rounded-full bg-white p-6 backdrop-blur-md ring-1 ring-white/20 shadow-2xl">
            <Image
              src="/images/ttu-logo.png"
              alt="Logo"
              width={160}
              height={160}
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow-md">
            Industrial Liason
          </h1>
          <p className="max-w-md text-lg text-white/80 font-medium leading-relaxed">
            Smarter supervision. Clear insights. Better outcomes for everyone.
          </p>
        </div>
      </div>

      {/* RIGHT - Form area */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 bg-white">
        {children}
      </div>
    </div>
  );
}
