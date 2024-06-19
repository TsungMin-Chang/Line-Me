import React from "react";

type Props = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

function AuthInput({ label, type, value, setValue }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="pl-1 font-semibold text-black">{label}</label>
      <input
        className="rounded-md border border-black text-black"
        type={type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

export default AuthInput;
