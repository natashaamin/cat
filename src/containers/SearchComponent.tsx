import React, { useEffect } from "react";
import "./SearchComponent.css";

interface searchProps {
  onChangeText: (value: any) => void;
  value: string;
}

const SearchComponent = (props: searchProps) => {
  const { onChangeText, value } = props;

  useEffect(() => {
    let input = document.querySelector("input");
    input?.addEventListener("input", onChangeText);
    return input?.removeEventListener("input", onChangeText);
  }, []);

  return (
    <div className="search-container">
      <input
        type="text"
        value={value}
        onChange={onChangeText}
        placeholder="Search breed by name"
      />
    </div>
  );
};

export default SearchComponent;
