interface ConcernsListProps {
  concerns: string[];
}

export const ConcernsList = ({ concerns }: ConcernsListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-medspa-800 mb-2">Identified Concerns</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {concerns.map((concern, index) => (
          <li key={index}>{concern}</li>
        ))}
      </ul>
    </div>
  );
};