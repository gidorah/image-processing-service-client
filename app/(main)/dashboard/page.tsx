import ImageUploader from "@/components/dashboard/image-uploader";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg p-4">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Upload Your Image
        </h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          Drag and drop an image file or click to select a file
        </p>
        <ImageUploader />
      </div>
    </div>
  );
}
