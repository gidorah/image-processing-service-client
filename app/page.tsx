import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Image Processing Service</h1>
        <p className="text-lg">
          This is the front-end of image processing service toy project of mine.
        </p>
        <p className="text-lg">
          It is a simple service that allows you to upload an image and process it.
        </p>
      </main>
    </div>
  );
}
