import { OptionValue } from '@/lib/types';

interface IProps {
  name: string;
  values: OptionValue[];
  selectedOptions: { [name: string]: OptionValue };
  setOptions: (name: string, value: OptionValue) => void;
}

export const ProductOptions = ({
  name,
  values,
  selectedOptions,
  setOptions,
}: IProps) => {
  return (
    <fieldset>
      <legend className="text-xl font-semibold">{name}</legend>
      <div className="inline-flex items-center flex-wrap">
        {values.map((value) => {
          const id = `option-${name}-${value.name}`;
          const checked = selectedOptions[name] === value;

          return (
            <label key={id}>
              <input
                type="radio"
                className="sr-only"
                value={value.name}
                checked={checked}
                id={id}
                name={`option-${name}`}
                onChange={() => {
                  setOptions(name, value);
                }}
              />
              <div
                className={`p-2 my-3 text-lg rounded-full block cursor-pointer mr-3 ${
                  checked
                    ? 'text-white bg-gray-900'
                    : 'text-gray-900 bg-gray-200'
                }`}
              >
                <span className="px-2">{value.name}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
