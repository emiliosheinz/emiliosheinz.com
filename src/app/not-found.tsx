// TODO - emiliosheinz: Improve the look and feel of this page

export default function NotFound() {
  return (
    <div className="flex items-center justify-center text-white">
      <div className="text-center px-4 space-y-8">
        <h1 className="font-bold text-5xl sm:text-6xl">
          404
        </h1>
        <p className="text-lg sm:text-xl max-w-md">
          Oops! This page has vanished into the digital void. Go back to safety using the header.
        </p>
      </div>
    </div>
  );
}

