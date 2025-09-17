type Props = {
  sortOption: string;
  onChange: (sortOption: string) => void;
};

const SortFilter = ({ sortOption, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2"> Sort By :</h4>
      <select
        className="p-2 border rounded-md w-full"
        value={sortOption}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="">Select Sort Option</option>
        <option value="starRating">Star Ratings</option>
        <option value="pericePerNightAsc">Price(low to high)</option>
        <option value="pricePerNightDesc">Price(high to low)</option>
      </select>
    </div>
  );
};

export default SortFilter;