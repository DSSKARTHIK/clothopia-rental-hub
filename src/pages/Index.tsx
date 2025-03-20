
import { useNavigate, useEffect } from "react";

// This is just a redirect component to the Home page
export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  
  return null;
}
