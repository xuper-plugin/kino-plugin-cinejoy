// The bar's logo: the plugin's icon (embedded as a data address by the build, so it draws with no network) beside its name.
// It is the bar's own copy (logo-bar.png), its corners painted in the bar's colour: transparent corners showed white there.
import ICON from "../../logo-bar.png";

export const logoNode = () => ({
  type: "Row", key: "logo", gap: 12, crossAxisAlignment: "center", children: [
    { type: "Image", key: "logoIcon", url: ICON, aspect: "1:1", fit: "contain", h: 32, width: 32, alt: "Cinejoy", altEn: "Cinejoy",
      fallback: { type: "Icon", name: "movie" } },
    { type: "Text", key: "logoText", text: "Cinejoy", textEn: "Cinejoy", style: "h4", bold: true },
  ],
});
