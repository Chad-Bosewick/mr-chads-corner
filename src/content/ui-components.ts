export interface UIComponentCard {
  id: string;
  src: string;
  alt: string;
  type?: "image" | "video";
  /** Selects a frame that respects the source composition. */
  frame?: "standard" | "widescreen" | "landing-hero" | "portrait-hero";
}

export const uiComponents: UIComponentCard[] = [
  { id: "card-01", src: "/images/ui-components/card-01.png", alt: "Puzzle platform landing-page hero", type: "image", frame: "landing-hero" },
  { id: "card-02", src: "/images/ui-components/card-02.png", alt: "The History of Africa timeline interface", type: "image", frame: "widescreen" },
  { id: "card-03", src: "/images/ui-components/card-03.png", alt: "Payment confirmation interface", type: "image" },
  { id: "card-04", src: "/images/ui-components/card-04.png", alt: "Executive membership upgrade prompt", type: "image" },
  { id: "card-05", src: "/images/ui-components/card-05.png", alt: "Creative studio landing-page hero", type: "image", frame: "landing-hero" },
  { id: "card-06", src: "/images/ui-components/card-06.mp4", alt: "UI animation preview", type: "video" },
  { id: "card-07", src: "/images/ui-components/card-07.png", alt: "SkillBridge landing-page hero", type: "image", frame: "portrait-hero" },
  { id: "card-08", src: "/images/ui-components/card-08.mp4", alt: "UI animation preview", type: "video" },
  { id: "card-09", src: "/images/ui-components/card-09.mp4", alt: "UI animation preview", type: "video" },
  { id: "card-10", src: "/images/ui-components/card-10.png", alt: "Fashion marketplace storefront", type: "image", frame: "portrait-hero" },
];
