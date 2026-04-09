import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-service";
import { trackCreation, trackDownload } from "@/lib/activity-tracker";
import SparkleIcon from "@/components/SparkleIcon";
import {
  ArrowRight, ArrowLeft, Upload, X, Download, RefreshCw,
  Sparkles, Loader2, Paintbrush, Layers, Palette, Type,
  Image as ImageIcon, Square, RectangleHorizontal, RectangleVertical, Lock,
} from "lucide-react";

type ImageType = "product" | "profile" | "logo" | "banner";
type StyleId = "realistic" | "minimal" | "luxury" | "cartoon" | "soft" | "modern";

const IMAGE_TYPES: { id: ImageType; he: string; en: string }[] = [
  { id: "product", he: "תמונת מוצר", en: "Product" },
  { id: "profile", he: "פרופיל עסקי", en: "Profile" },
  { id: "logo", he: "לוגו", en: "Logo" },
  { id: "banner", he: "באנר", en: "Banner" },
];

const STYLES: { id: StyleId; he: string; en: string }[] = [
  { id: "realistic", he: "ריאליסטי", en: "Realistic" },
  { id: "minimal", he: "מינימליסטי", en: "Minimalist" },
  { id: "luxury", he: "יוקרתי", en: "Luxury" },
  { id: "cartoon", he: "אילוסטרציה", en: "Illustration" },
  { id: "soft", he: "רך ועדין", en: "Soft" },
  { id: "modern", he: "מודרני", en: "Modern" },
];

const PRESET_COLORS = [
  "#ffffff", "#111111", "#f5f0e8", "#1a1a3e", "#f5e0e0", "#d4ddd0",
  "#fef3c7", "#dbeafe", "#fce7f3", "#d1fae5", "#e0e7ff", "#fde68a",
];

const RATIOS = [
  { id: "1:1", icon: Square, label: "1:1" },
  { id: "4:3", icon: RectangleHorizontal, label: "4:3" },
  { id: "9:16", icon: RectangleVertical, label: "9:16" },
  { id: "16:9", icon: RectangleHorizontal, label: "16:9" },
];

const USAGE_KEY = "bizaira_image_studio_usage";

function getUsage(): { count: number; month: number } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { count: 0, month: new Date().getMonth() };
    const parsed = JSON.parse(raw);
    if (parsed.month !== new Date().getMonth()) return { count: 0, month: new Date().getMonth() };
    return parsed;
  } catch { return { count: 0, month: new Date().getMonth() }; }
}

function incrementUsage() {
  const usage = getUsage();
  usage.count += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

const ImageStudioPage = () => {
  const { t, lang } = useI18n();
  const isHe = lang === "he";
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [imageType, setImageType] = useState<ImageType>("product");
  const [style, setStyle] = useState<StyleId>("realistic");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [ratio, setRatio] = useState("1:1");
  const [description, setDescription] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"type" | "style" | "details">("type");

  const usage = getUsage();
  const isLocked = usage.count >= 5;
  const remaining = Math.max(0, 5 - usage.count);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setUploadedImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (isLocked) return;
    setIsGenerating(true);
    setResults([]);
    try {
      const typeMap: Record<string, string> = {
        product: "professional product photograph", profile: "professional business profile portrait",
        logo: "modern clean logo design", banner: "marketing banner image",
      };
      const styleMap: Record<string, string> = {
        realistic: "photorealistic, high-end studio quality", minimal: "minimalist, clean lines, lots of whitespace",
        luxury: "luxury premium, elegant, sophisticated", cartoon: "modern illustration style, clean vectors",
        soft: "soft, gentle, warm dreamy aesthetic", modern: "contemporary modern, bold and crisp",
      };

      const base = `Create a ${typeMap[imageType]}. Style: ${styleMap[style]}. Background color: ${bgColor}. Aspect ratio: ${ratio}. ${description ? `Details: ${description}.` : ""} Professional quality, perfect composition, high resolution.`;

      const promises = [
        generateImage(base, uploadedImage || undefined),
        generateImage(base + " Alternative composition.", uploadedImage || undefined),
      ];

      const settled = await Promise.allSettled(promises);
      const images = settled.filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled").map(r => r.value);

      if (images.length === 0) throw new Error("Generation failed");
      setResults(images);
      setActiveResult(0);
      incrementUsage();
      trackCreation(); // Track the creation action
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (index: number) => {
    const img = results[index];
    if (!img) return;
    const a = document.createElement("a");
    a.href = img;
    a.download = `bizaira-image-${index + 1}.png`;
    a.click();
    trackDownload(); // Track the download action
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-gray-50 to-luxury-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/create" className="luxury-glass p-3 rounded-lg hover:bg-luxury-gray-100 luxury-transition">
                <BackArrow size={20} className="text-luxury-gray-600" />
              </Link>
              <div>
                <h1 className="luxury-heading-2 text-luxury-black">
                  {isHe ? "סטודיו תמונות" : "Image Studio"}
                </h1>
                <p className="luxury-body text-luxury-gray-600 mt-1">
                  {isHe ? "צור תמונות מקצועיות באמצעות AI" : "Create professional images with AI"}
                </p>
              </div>
            </div>

            {/* Usage indicator */}
            <div className="luxury-glass px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-luxury-navy" />
                <span className="luxury-body-small text-luxury-gray-600">
                  {remaining} {isHe ? "תמונות נותרו" : "images left"}
                </span>
              </div>
            </div>
          </div>
        </div>


      {/* Locked overlay */}
      {isLocked && (
        <div className="max-w-6xl mx-auto w-full px-4 pt-6">
          <div className="glass-card rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Lock size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{isHe ? "הגעת למגבלה החודשית" : "Monthly Limit Reached"}</h2>
            <p className="text-sm text-muted-foreground">{isHe ? "השתמשת ב-5 פעולות החודש. הכ��י ייפתח מחדש בחודש הבא." : "You've used 5 actions this month. The tool will unlock next month."}</p>
            <Link to="/pricing" className="inline-block gradient-glow text-primary-foreground font-bold px-6 py-3 rounded-xl hover:scale-[1.02] transition-all">
              {isHe ? "שדרג ל-PRO" : "Upgrade to PRO"}
            </Link>
          </div>
        </div>
      )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="luxury-card rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center relative">
              {results.length > 0 ? (
                <img src={results[activeResult]} alt={`Generated ${activeResult + 1}`} className="w-full h-full object-contain max-h-[500px]" />
              ) : uploadedImage ? (
                <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
                  <img src={uploadedImage} alt="Uploaded" className="max-h-[400px] object-contain rounded-lg" />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-4 right-4 luxury-glass p-2 rounded-lg hover:bg-luxury-gray-100 luxury-transition"
                  >
                    <X size={16} className="text-luxury-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 luxury-glass rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Paintbrush size={32} className="text-luxury-gray-400" />
                  </div>
                  <h3 className="luxury-heading-3 text-luxury-black mb-2">
                    {isHe ? "התמונות שלך יופיעו כאן" : "Your images will appear here"}
                  </h3>
                  <p className="luxury-body text-luxury-gray-600">
                    {isHe ? "מלא פרטים ולחץ ׳צור תמונות׳" : "Fill details and click 'Create Images'"}
                  </p>
                </div>
              )}
            </div>

            {results.length > 1 && (
              <div className="flex gap-3 justify-center">
                {results.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveResult(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 luxury-transition hover:scale-105 ${
                      activeResult === i
                        ? "border-luxury-gold shadow-lg"
                        : "border-luxury-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`V${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 luxury-gold-accent text-white font-medium py-4 rounded-lg hover:shadow-xl luxury-transition luxury-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    {isHe ? "יוצר תמונות..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={18} />
                    {isHe ? "צור תמונות" : "Create Images"}
                  </div>
                )}
              </button>
              {results.length > 0 && (
                <button
                  onClick={() => handleDownload(activeResult)}
                  className="luxury-glass px-6 py-4 rounded-lg text-luxury-gray-700 hover:text-luxury-black luxury-transition"
                >
                  <Download size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full luxury-glass py-4 rounded-lg text-luxury-gray-600 hover:text-luxury-black luxury-transition flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {isHe ? "העלה תמונת מקור (אופציונלי)" : "Upload reference image (optional)"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

            <button onClick={() => fileRef.current?.click()} className="w-full glass-card py-3 rounded-xl text-sm font-medium text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground hover:scale-[1.01] transition-all">
              <Upload size={16} />
              {isHe ? "העלה תמונת מקור (אופציונלי)" : "Upload reference image (optional)"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex gap-2 luxury-glass rounded-lg p-1">
              {([
                { id: "type" as const, icon: ImageIcon, label: isHe ? "סוג" : "Type" },
                { id: "style" as const, icon: Palette, label: isHe ? "סגנון" : "Style" },
                { id: "details" as const, icon: Type, label: isHe ? "פרטים" : "Details" },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg luxury-body-small font-medium luxury-transition ${
                    sidebarTab === tab.id
                      ? "luxury-gold-accent text-white shadow-lg"
                      : "text-luxury-gray-600 hover:text-luxury-black hover:bg-luxury-gray-100"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {sidebarTab === "type" && (
              <div className="space-y-6 animate-fade-in">
                <div className="luxury-card rounded-lg p-6 space-y-4">
                  <div>
                    <label className="luxury-body-small font-medium text-luxury-black block mb-3">
                      {isHe ? "סוג תמונה" : "Image Type"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {IMAGE_TYPES.map(it => (
                        <button
                          key={it.id}
                          onClick={() => setImageType(it.id)}
                          className={`p-3 rounded-lg text-center luxury-transition luxury-hover-lift ${
                            imageType === it.id
                              ? "luxury-gold-accent text-white"
                              : "luxury-glass text-luxury-gray-700 hover:text-luxury-black"
                          }`}
                        >
                          <div className="luxury-body-small font-medium">
                            {isHe ? it.he : it.en}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="luxury-body-small font-medium text-luxury-black block mb-3">
                      {isHe ? "יחס תמונה" : "Aspect Ratio"}
                    </label>
                    <div className="flex gap-3">
                      {RATIOS.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setRatio(r.id)}
                          className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg luxury-transition luxury-hover-lift ${
                            ratio === r.id
                              ? "luxury-gold-accent text-white"
                              : "luxury-glass text-luxury-gray-700 hover:text-luxury-black"
                          }`}
                        >
                          <r.icon size={18} />
                          <span className="luxury-caption">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "style" && (
              <div className="space-y-6 animate-fade-in">
                <div className="luxury-card rounded-lg p-6 space-y-4">
                  <div>
                    <label className="luxury-body-small font-medium text-luxury-black block mb-3">
                      {isHe ? "סגנון עיצוב" : "Design Style"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {STYLES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`p-3 rounded-lg text-center luxury-transition luxury-hover-lift ${
                            style === s.id
                              ? "luxury-gold-accent text-white"
                              : "luxury-glass text-luxury-gray-700 hover:text-luxury-black"
                          }`}
                        >
                          <div className="luxury-body-small font-medium">
                            {isHe ? s.he : s.en}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="luxury-body-small font-medium text-luxury-black block mb-3">
                      {isHe ? "צבע רקע" : "Background Color"}
                    </label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setBgColor(color)}
                          className={`w-8 h-8 rounded-lg border-2 luxury-transition hover:scale-110 ${
                            bgColor === color ? "border-luxury-gold shadow-lg" : "border-luxury-gray-200"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                          setBgColor(e.target.value);
                        }}
                        className="w-12 h-8 rounded-lg border border-luxury-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 luxury-glass px-3 py-2 rounded-lg luxury-body-small text-luxury-gray-700 placeholder-luxury-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === "details" ? (
              <div className="space-y-6 animate-fade-in">
                <div className="luxury-card rounded-lg p-6 space-y-4">
                  <div>
                    <label className="luxury-body-small font-medium text-luxury-black block mb-3">
                      {isHe ? "תיאור מפורט" : "Detailed Description"}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={isHe ? "תאר את התמונה הרצויה..." : "Describe the desired image..."}
                      rows={4}
                      className="w-full luxury-glass px-4 py-3 rounded-lg luxury-body-small text-luxury-gray-700 placeholder-luxury-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
    </div>
  );
};

export default ImageStudioPage;
