import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useChangeTabs = () => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const handleTabClick = (key: string) => {
    navigate(`${pathname}?key=${key}`);
  };

  const [urlKey, setUrlKey] = useState("1");

  useEffect(() => {
    const urlKey = search.split("=")[1];
    if (urlKey) {
      setUrlKey(urlKey);
    }
  }, [search]);

  return {
    urlKey,
    handleTabClick
  };
};

export default useChangeTabs;
