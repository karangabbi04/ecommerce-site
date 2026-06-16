"use client"

interface AddressSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
}

type Props = {
  suggestions: AddressSuggestion[];
  visible: boolean;
  onSelect: (address: AddressSuggestion) => void;
};

export function AddressAutocomplete({
  suggestions,
  visible,
  onSelect,
}: Props) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border bg-white shadow-lg">
      {suggestions.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className="block w-full border-b px-4 py-3 text-left hover:bg-zinc-100"
        >
          <div className="font-medium">
            {item.name}
          </div>

          <div className="text-sm text-zinc-500">
            {item.city}, {item.state}
          </div>
        </button>
      ))}
    </div>
  );
}