interface RecommendationsListProps {
  recommendations: string[];
}

export const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-medspa-800 mb-2">Recommended Treatments</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};