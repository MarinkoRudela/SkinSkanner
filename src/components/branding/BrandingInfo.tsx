interface BrandingInfoProps {
  brandName: string | null;
  tagline: string | null;
  isLoading: boolean;
}

export const BrandingInfo = ({ brandName, tagline, isLoading }: BrandingInfoProps) => {
  if (isLoading) {
    return (
      <>
        <div className="h-8 w-48 mx-auto mb-2 bg-gray-100 animate-pulse rounded" />
        <div className="h-4 w-64 mx-auto bg-gray-100 animate-pulse rounded" />
      </>
    );
  }

  return (
    <>
      {brandName && (
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">
          {brandName}
        </h1>
      )}
      <p className="text-lg text-indigo-700">
        {tagline || "Because radiant skin is just a 'skan' away"}
      </p>
    </>
  );
};