// This route catches /products/:categorySlug and redirects to the
// correct URL so the full products page (with buy logic) handles it.
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CategoryRedirect() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to the correct products URL with cat param
    navigate(`/products${categorySlug ? `?cat=${categorySlug}` : ""}`, { replace: true });
  }, [categorySlug, navigate]);

  return null;
}
