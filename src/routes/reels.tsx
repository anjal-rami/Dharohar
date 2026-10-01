import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ChevronDown,
  ChevronUp,
  Headphones,
  Heart,
  MapPin,
  Pause,
  Play,
  Rotate3d,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { REELS, getSite, type Reel, type HeritageSite } from "@/lib/heritage-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "Heritage Shorts & Reels — Interactive 3D Stories | Dharohar" },
      {
        name: "description",
        content:
          "Vertical, synchronized heritage reels with Indic voice narration, live subtitles, and direct deep-linking to 3D monument inspectors.",
      },
      { property: "og:title", content: "Dharohar Sanskriti Reels — Immersive Heritage Stories" },
      {
        property: "og:description",
        content:
          "Experience India's timeless monuments through full-screen vertical stories, bilingual narration, and 3D architectural views.",
      },
    ],
  }),
  component: ReelsView,
});

// Timed subtitle tracks for local featured reels
interface TimedSubtitle {
  start: number;
  end: number;
  en: string;
  hi: string;
}

const REEL_SUBTITLES: Record<string, TimedSubtitle[]> = {
  "reel-golconda": [
    {
      start: 0,
      end: 14,
      en: "Perched 400 feet above Hyderabad, Golconda Fort was the medieval diamond capital of the world.",
      hi: "हैदराबाद से 400 फीट ऊपर स्थित गोलकोंडा किला विश्व में हीरों का सबसे बड़ा ऐतिहासिक केंद्र था।",
    },
    {
      start: 14,
      end: 28,
      en: "Engineered with acoustic genius: a clap at the Fateh Darwaza dome echoes to the mountaintop 1 km away.",
      hi: "अद्भुत ध्वनि चमत्कार: फतेह दरवाज़े की एक ताली 1 किमी दूर पहाड़ की चोटी पर स्थित महल में गूँजती है।",
    },
    {
      start: 28,
      end: 42,
      en: "Its royal vaults once guarded the Koh-i-Noor, Hope Diamond, and Daria-i-Noor through centuries of siege.",
      hi: "यहीं कोहिनूर, होप डायमंड और दरिया-ए-नूर जैसे विश्व-प्रसिद्ध हीरों का सुरक्षित शाही खजाना था।",
    },
    {
      start: 42,
      end: 60,
      en: "Explore its acoustic domes, secret subterranean escape tunnels, and majestic hilltop pavilions.",
      hi: "गोलकोंडा की प्राचीन ध्वनि मेहराबों, शाही महलों और गुप्त भूमिगत रास्तों का प्रत्यक्ष अनुभव करें।",
    },
  ],
  "reel-01": [
    {
      start: 0,
      end: 13,
      en: "Rising 66 meters over Thanjavur, Brihadisvara was consecrated in 1010 CE by Emperor Rajaraja Chola I.",
      hi: "तंजावुर में 66 मीटर ऊंचा बृहदीश्वर मंदिर 1010 ईस्वी में चोल सम्राट राजराज प्रथम द्वारा बनाया गया।",
    },
    {
      start: 13,
      end: 25,
      en: "The colossal 80-tonne granite dome atop the vimana was sculpted from a single massive boulder.",
      hi: "मंदिर के 66 मीटर ऊंचे शिखर पर 80 टन का अखंड ग्रेनाइट कुंभ स्थापित किया गया है।",
    },
    {
      start: 25,
      end: 37,
      en: "Constructed entirely of interlocking granite blocks without a single ounce of binding mortar or cement.",
      hi: "बिना किसी गारे या सीमेंट के, केवल इंटरलॉकिंग ग्रेनाइट पत्थरों से यह भव्य संरचना तैयार की गई।",
    },
    {
      start: 37,
      end: 55,
      en: "A pinnacle of Dravidian stonecraft designed to cast no shadow on the sanctum at high noon.",
      hi: "प्राचीन द्रविड़ इंजीनियरिंग का चमत्कार, जिसकी छाया दोपहर के समय धरती पर नहीं पड़ती।",
    },
  ],
  "reel-modhera": [
    {
      start: 0,
      end: 16,
      en: "Built in 1026 CE by King Bhima I of the Solanki dynasty, Modhera sits aligned on the Tropic of Cancer.",
      hi: "1026 ईस्वी में सोलंकी राजा भीम प्रथम द्वारा निर्मित, मोढेरा कर्क रेखा पर पूर्णतः संरेखित है।",
    },
    {
      start: 16,
      end: 32,
      en: "During equinox dawn, the first golden sunbeams pierced straight through the carved pillars into the sanctum.",
      hi: "विषुव के दिन, उगते सूर्य की पहली किरण सीधे नक्काशीदार स्तंभों से होती हुई गर्भगृह को आलोकित करती थी।",
    },
    {
      start: 32,
      end: 48,
      en: "The sacred stepped Surya Kund features 108 miniature shrines mirroring Vedic astronomical geometry.",
      hi: "पवित्र सूर्य कुंड में 108 नक्काशीदार लघु मंदिर हैं जो वैदिक खगोलीय ज्यामिति को दर्शाते हैं।",
    },
    {
      start: 48,
      end: 70,
      en: "Marvel at the sandstone reliefs of the twelve Adityas depicting the sun in every seasonal cycle.",
      hi: "बारह आदित्यों की नक्काशीदार बलुआ पत्थर की मूर्तियों के दर्शन करें जो हर महीने के सूर्य को दर्शाती हैं।",
    },
  ],
  "reel-indus": [
    {
      start: 0,
      end: 18,
      en: "Flourishing 4,500 years ago on Khadir Bet in Gujarat, Dholavira is a grand Bronze Age metropolis.",
      hi: "4,500 वर्ष पूर्व गुजरात के कच्छ में विकसित धोलावीरा सिंधु घाटी की सबसे भव्य नगरियों में से एक है।",
    },
    {
      start: 18,
      end: 38,
      en: "Prehistoric hydraulic engineering: sixteen stone-cut reservoirs captured and filtered every drop of monsoon rain.",
      hi: "प्राचीन जल प्रबंधन का करिश्मा: 16 विशाल पत्थर के जलाशय मानसून की हर एक बूंद को सहेजते थे।",
    },
    {
      start: 38,
      end: 56,
      en: "Home to the world's earliest known multi-character public inscription signboard and citadel zoning.",
      hi: "विश्व का सबसे प्राचीन 10 अक्षरों वाला सार्वजनिक सूचना-पट्ट (साइनबोर्ड) यहीं खोजा गया था।",
    },
    {
      start: 56,
      end: 80,
      en: "Step into the fortified citadel, underground drains, and ancient lapidary workshops of this Harappan capital.",
      hi: "इस यूनेस्को विश्व धरोहर स्थल के गढ़, जलाशयों और मनका निर्माण कार्यशालाओं का अनुभव करें।",
    },
  ],
};

// Concise 2-sentence cultural summaries for Web Speech API Text-to-Speech narration
const REEL_NARRATIONS: Record<string, { en: string; hi: string }> = {
  "reel-golconda": {
    en: "Golconda Fort is an architectural marvel renowned for acoustic engineering where a handclap at the gate echoes one kilometer away. It once guarded the legendary Koh-i-Noor diamond within its impregnable granite walls.",
    hi: "गोलकोंडा किला अपनी अद्भुत ध्वनि अभियांत्रिकी के लिए विश्वप्रसिद्ध है जहाँ प्रवेश द्वार की एक ताली एक किलोमीटर दूर तक सुनाई देती है। यह ऐतिहासिक किला कोहिनूर और होप डायमंड जैसे बहुमूल्य रत्नों का सुरक्षित खजाना रहा है।",
  },
  "reel-01": {
    en: "The Brihadeeswarar Temple in Thanjavur is a towering Chola monument built entirely of interlocking granite with no mortar. Its sixty-six meter vimana is crowned by an eighty-tonne monolithic stone carved from a single boulder.",
    hi: "तंजावुर का बृहदीश्वर मंदिर बिना किसी गारे या सीमेंट के केवल इंटरलॉकिंग ग्रेनाइट से बना चोल साम्राज्य का गौरव है। इसके छांसठ मीटर ऊंचे शिखर पर अस्सी टन का एक ही पत्थर से तराशा गया भारी कुंभ स्थापित है।",
  },
  "reel-modhera": {
    en: "The Sun Temple at Modhera is an eleventh-century marvel aligned so equinox dawn rays illuminated the inner sanctum. Its sacred stepped Surya Kund reservoir is surrounded by one hundred and eight miniature shrines.",
    hi: "मोढेरा का सूर्य मंदिर ग्यारहवीं शताब्दी का एक खगोलीय चमत्कार है जहाँ विषुव के दिन सूर्य की पहली किरण गर्भगृह को प्रकाशित करती थी। इसका पवित्र सूर्य कुंड एक सौ आठ सुंदर लघु मंदिरों से घिरा हुआ है।",
  },
  "reel-indus": {
    en: "Dholavira in the Rann of Kutch was a thriving metropolis of the Indus Valley Civilization over four thousand years ago. It featured groundbreaking urban planning with sixteen massive stone-cut rainwater harvesting reservoirs.",
    hi: "कच्छ के रण में स्थित धोलावीरा चार हजार वर्ष पुरानी सिंधु घाटी सभ्यता का एक प्रमुख महानगर था। इसमें सोलह विशाल पत्थरों से कटे जलाशयों के साथ जल संचयन की अत्यंत उन्नत तकनीक मौजूद थी।",
  },
};

export function ReelsView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeLang, setActiveLang] = useState<"en" | "hi">("en");
  const [isTtsActive, setIsTtsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Persistent liked reel IDs
  const [likedReelIds, setLikedReelIds] = useState<Set<string>>(new Set());

  // Refs to individual slides & video elements
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Video progress state for active reel
  const [activeCurrentTime, setActiveCurrentTime] = useState(0);
  const [activeDuration, setActiveDuration] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);

  // Ensure client-side initialization
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = window.localStorage.getItem("dharohar_liked_reels");
      if (stored) {
        setLikedReelIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Web Speech API: cancel active utterance
  const cancelSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      setIsSpeaking(false);
    }
  }, []);

  // Web Speech API: synthesize 2-sentence summary
  const speakCurrentReel = useCallback(
    (reelId: string, lang: "en" | "hi") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      cancelSpeech();

      const narration =
        REEL_NARRATIONS[reelId] || {
          en: "Discover India's verified cultural heritage monuments through immersive 3D digital records.",
          hi: "भारत की समृद्ध सांस्कृतिक धरोहर और ऐतिहासिक स्मारकों का अन्वेषण करें।",
        };

      const text = lang === "hi" ? narration.hi : narration.en;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select regional voice if installed
      const voices = window.speechSynthesis.getVoices();
      const regionalVoice = voices.find((v) =>
        lang === "hi"
          ? v.lang.includes("hi") || v.name.toLowerCase().includes("hindi")
          : v.lang.includes("en-IN") || v.name.toLowerCase().includes("india"),
      );
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [cancelSpeech],
  );

  // IntersectionObserver: Full-viewport vertical snap tracking & auto-play
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexStr = entry.target.getAttribute("data-index");
          if (indexStr === null) return;
          const idx = parseInt(indexStr, 10);
          const video = videoRefs.current[idx];

          if (entry.isIntersecting) {
            setActiveIndex(idx);
            setIsPlaying(true);
            setActiveCurrentTime(0);

            if (video) {
              video.currentTime = 0;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Mute and retry if unmuted autoplay is blocked by browser policy
                  video.muted = true;
                  setIsMuted(true);
                  video.play().catch(() => {});
                });
              }
            }
          } else {
            if (video) {
              video.pause();
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.65,
      },
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      cancelSpeech();
    };
  }, [isMounted, cancelSpeech]);

  // Handle active speech narration trigger when index or language changes
  useEffect(() => {
    if (!isMounted) return;
    const currentReel = REELS[activeIndex];
    if (isTtsActive && currentReel) {
      speakCurrentReel(currentReel.id, activeLang);
    } else {
      cancelSpeech();
    }
    return () => cancelSpeech();
  }, [activeIndex, isTtsActive, activeLang, isMounted, speakCurrentReel, cancelSpeech]);

  // Keyboard navigation (Arrow keys, Space, Mute, Like)
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToReel(Math.min(activeIndex + 1, REELS.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToReel(Math.max(activeIndex - 1, 0));
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        const reel = REELS[activeIndex];
        if (reel) toggleLike(reel.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, isMounted]);

  // Scroll to slide helper
  const scrollToReel = (index: number) => {
    const target = slideRefs.current[index];
    if (target && containerRef.current) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle Video Play / Pause
  const togglePlayPause = () => {
    const video = videoRefs.current[activeIndex];
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute across videos
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((v) => {
      if (v) v.muted = nextMuted;
    });
    toast(nextMuted ? "Audio muted" : "Audio unmuted");
  };

  // Toggle Like persistence
  const toggleLike = (reelId: string) => {
    setLikedReelIds((prev) => {
      const next = new Set(prev);
      const wasLiked = next.has(reelId);
      if (wasLiked) {
        next.delete(reelId);
        toast("Removed endorsement");
      } else {
        next.add(reelId);
        toast.success("Endorsed & saved to your collection!");
      }
      try {
        window.localStorage.setItem("dharohar_liked_reels", JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle Text-to-Speech Voice Narration
  const toggleTts = () => {
    const nextState = !isTtsActive;
    setIsTtsActive(nextState);
    if (nextState) {
      toast.success("Voice narration enabled", {
        description: `Speaking summary in ${activeLang === "hi" ? "Hindi" : "Indian English"}`,
      });
      const currentReel = REELS[activeIndex];
      if (currentReel) speakCurrentReel(currentReel.id, activeLang);
    } else {
      cancelSpeech();
      toast("Voice narration disabled");
    }
  };

  // Switch between English and Hindi
  const toggleLanguage = () => {
    const next = activeLang === "en" ? "hi" : "en";
    setActiveLang(next);
    toast.success(`Language switched to ${next === "hi" ? "हिंदी (Hindi)" : "English"}`);
  };

  // Share reel
  const handleShare = (reel: Reel) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const url = `${window.location.origin}/heritage/${reel.siteSlug}`;
      navigator.clipboard.writeText(url);
      toast.success("Monument share link copied to clipboard!");
    } else {
      toast.success("Share link ready");
    }
  };

  // Active reel helper
  const currentReel = REELS[activeIndex] ?? REELS[0]!;
  const currentSite = useMemo(
    () => (currentReel ? getSite(currentReel.siteSlug) : undefined),
    [currentReel],
  );

  // Synchronized active caption
  const activeSubtitle = useMemo(() => {
    if (!currentReel) return "";
    const subs = REEL_SUBTITLES[currentReel.id];
    if (!subs || subs.length === 0) {
      return activeLang === "hi"
        ? currentReel.caption.hi || currentReel.caption.en || ""
        : currentReel.caption.en || currentReel.caption.hi || "";
    }
    const current =
      subs.find((s) => activeCurrentTime >= s.start && activeCurrentTime < s.end) ??
      subs[subs.length - 1];

    if (!current) return "";
    return activeLang === "hi" ? current.hi : current.en;
  }, [currentReel, activeCurrentTime, activeLang]);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-stone-950 font-sans text-stone-100 select-none">
      {/* Soundwave Animation Keyframe Styles */}
      <style>{`
        @keyframes dharohar-eq-bar {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .eq-bar-1 { animation: dharohar-eq-bar 0.7s ease-in-out infinite; }
        .eq-bar-2 { animation: dharohar-eq-bar 0.7s ease-in-out infinite 0.22s; }
        .eq-bar-3 { animation: dharohar-eq-bar 0.7s ease-in-out infinite 0.44s; }
      `}</style>

      {/* Floating Top Header Overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex items-center justify-between px-4 sm:px-8">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-stone-800/80 bg-stone-950/85 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-xl">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] text-amber-400">Heritage Shorts</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-300">
            {activeIndex + 1} of {REELS.length}
          </span>
        </div>

        {/* Desktop Navigation Chevrons */}
        <div className="pointer-events-auto hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => scrollToReel(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
            className="flex size-9 items-center justify-center rounded-full border border-stone-800 bg-stone-950/85 text-stone-300 backdrop-blur transition hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous Reel"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToReel(Math.min(activeIndex + 1, REELS.length - 1))}
            disabled={activeIndex === REELS.length - 1}
            className="flex size-9 items-center justify-center rounded-full border border-stone-800 bg-stone-950/85 text-stone-300 backdrop-blur transition hover:bg-stone-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next Reel"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* Full-Viewport Vertical Snap-Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {REELS.map((reel, index) => {
          const isCurrent = index === activeIndex;
          const site = getSite(reel.siteSlug);
          const hasLiked = likedReelIds.has(reel.id);
          const likesCount = reel.likes + (hasLiked ? 1 : 0);

          return (
            <div
              key={reel.id}
              data-index={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="relative flex h-full w-full snap-start snap-always items-center justify-center bg-stone-950 overflow-hidden"
            >
              {/* Ambient Background Blur: Gives cinematic depth on large desktop displays */}
              {reel.videoSrc ? (
                <video
                  src={reel.videoSrc}
                  poster={reel.poster}
                  muted
                  loop
                  playsInline
                  className="pointer-events-none absolute inset-0 size-full object-cover opacity-25 blur-3xl scale-110"
                />
              ) : (
                <img
                  src={reel.poster}
                  alt=""
                  className="pointer-events-none absolute inset-0 size-full object-cover opacity-20 blur-3xl scale-110"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset["fallbackApplied"]) return;
                    target.dataset["fallbackApplied"] = "true";
                    target.src = "/assets/hero-heritage.jpg";
                  }}
                />
              )}

              {/* Main Vertical Reel Viewport Card (9:16 Aspect Mobile Experience) */}
              <div className="relative flex h-full w-full max-w-[480px] items-center justify-center bg-black overflow-hidden shadow-2xl md:rounded-3xl md:h-[96%] md:border md:border-stone-800/80">
                {/* Video Media Element */}
                {reel.videoSrc ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={reel.videoSrc}
                    poster={reel.poster}
                    muted={isMuted}
                    loop
                    playsInline
                    onClick={togglePlayPause}
                    onTimeUpdate={(e) => {
                      if (isCurrent) {
                        setActiveCurrentTime(e.currentTarget.currentTime);
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      if (isCurrent && e.currentTarget.duration) {
                        setActiveDuration(e.currentTarget.duration);
                      }
                    }}
                    className="h-full w-full object-cover cursor-pointer"
                  />
                ) : (
                  <img
                    src={reel.poster}
                    alt={reel.title.en}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.dataset["fallbackApplied"]) return;
                      target.dataset["fallbackApplied"] = "true";
                      target.src = "/assets/hero-heritage.jpg";
                    }}
                  />
                )}

                {/* Big Centered Play/Pause Watermark Button when paused */}
                {isCurrent && !isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="pointer-events-auto absolute z-20 flex size-20 items-center justify-center rounded-full bg-stone-950/65 text-amber-400 backdrop-blur-md transition-transform hover:scale-110 shadow-2xl"
                    aria-label="Play Video"
                  >
                    <Play className="ml-1.5 size-9 fill-current" />
                  </button>
                )}

                {/* Scrim Gradient Overlays for Readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone-950/80 to-transparent" />

                {/* Bottom-Left Synchronized Captions & Metadata Scrim */}
                <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col justify-end p-4 pb-2 sm:p-6 text-white max-w-[82%]">
                  {/* Category & Status Tags */}
                  <div className="mb-2 flex items-center gap-2">
                    {site && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30 backdrop-blur">
                        <MapPin className="size-3" />
                        {site.district ? `${site.district}, ` : ""}
                        {site.state}
                      </span>
                    )}
                    {reel.aiAssisted && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-stone-800/80 px-2 py-0.5 text-[10px] font-medium text-stone-300 backdrop-blur">
                        <Sparkles className="size-2.5 text-amber-400" />
                        Verified Archive
                      </span>
                    )}
                  </div>

                  {/* Monument / Story Title */}
                  <h2 className="line-clamp-2 text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md font-display">
                    {activeLang === "hi"
                      ? reel.title.hi || reel.title.en
                      : reel.title.en || reel.title.hi}
                  </h2>

                  {/* Dynamic Synchronized Captions Box */}
                  <div className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-stone-800/70 bg-stone-950/80 p-3 backdrop-blur-md shadow-lg">
                    <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-stone-200 line-clamp-3">
                      {isCurrent ? activeSubtitle : reel.caption[activeLang] || reel.caption.en}
                    </p>
                  </div>

                  {/* Narrator Credential */}
                  <p className="mt-2 text-[11px] text-stone-400">
                    Voiceover: <span className="text-stone-300">{reel.narrator}</span>
                  </p>
                </div>

                {/* Right-Side Vertical Floating Action Rail */}
                <aside className="pointer-events-auto absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3.5 sm:right-4">
                  {/* 1. Like / Endorse Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(reel.id);
                    }}
                    className="group flex flex-col items-center gap-1"
                    aria-label="Endorse this heritage short"
                  >
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/85 text-white backdrop-blur-md shadow-lg transition-transform active:scale-90 group-hover:scale-105",
                        hasLiked && "border-rose-500/50 bg-rose-500/20 text-rose-400",
                      )}
                    >
                      <Heart
                        className={cn(
                          "size-5 transition-colors",
                          hasLiked ? "fill-rose-500 text-rose-500" : "text-stone-200",
                        )}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-300">
                      {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
                    </span>
                  </button>

                  {/* 2. Audio / Mute Switch with Animated Soundwave Equalizer */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="group flex flex-col items-center gap-1"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    <div
                      className={cn(
                        "relative flex size-11 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/85 text-stone-200 backdrop-blur-md shadow-lg transition-transform active:scale-90 group-hover:scale-105",
                        !isMuted && "border-amber-500/60 bg-amber-500/20 text-amber-400",
                      )}
                    >
                      {isMuted ? (
                        <VolumeX className="size-5" />
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 rounded-full bg-amber-400 eq-bar-1" />
                          <span className="w-1 rounded-full bg-amber-400 eq-bar-2" />
                          <span className="w-1 rounded-full bg-amber-400 eq-bar-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">
                      {isMuted ? "Muted" : "Live"}
                    </span>
                  </button>

                  {/* 3. Text-to-Speech (TTS) Voiceover Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTts();
                    }}
                    className="group flex flex-col items-center gap-1"
                    aria-label="Toggle voiceover narration"
                  >
                    <div
                      className={cn(
                        "relative flex size-11 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/85 text-stone-200 backdrop-blur-md shadow-lg transition-transform active:scale-90 group-hover:scale-105",
                        isTtsActive && "border-emerald-500/60 bg-emerald-500/20 text-emerald-400",
                        isSpeaking && "ring-2 ring-emerald-400 ring-offset-2 ring-offset-stone-950",
                      )}
                    >
                      <Headphones className="size-5" />
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">
                      {isSpeaking ? "Speaking" : isTtsActive ? "Narration" : "Voice"}
                    </span>
                  </button>

                  {/* 4. Language Narration Toggle (EN / HI) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLanguage();
                    }}
                    className="group flex flex-col items-center gap-1"
                    aria-label="Toggle language between English and Hindi"
                  >
                    <div className="flex size-11 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/85 text-xs font-bold text-amber-300 backdrop-blur-md shadow-lg transition-transform active:scale-90 group-hover:scale-105">
                      {activeLang === "en" ? "EN" : "HI"}
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">
                      {activeLang === "en" ? "English" : "हिंदी"}
                    </span>
                  </button>

                  {/* 5. Direct Deep-Link to 3D Monument Inspector */}
                  <Link
                    to="/heritage/$slug"
                    params={{ slug: reel.siteSlug }}
                    className="group flex flex-col items-center gap-1"
                    aria-label="Open 3D Model inspection"
                  >
                    <div className="flex size-11 items-center justify-center rounded-full border border-amber-500/70 bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-bold shadow-lg shadow-amber-500/20 transition-transform active:scale-90 group-hover:scale-110">
                      <Rotate3d className="size-5 animate-spin-slow" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400">3D View</span>
                  </Link>

                  {/* 6. Share Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(reel);
                    }}
                    className="group flex flex-col items-center gap-1"
                    aria-label="Share short"
                  >
                    <div className="flex size-11 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/85 text-stone-300 backdrop-blur-md shadow-lg transition-transform active:scale-90 group-hover:scale-105">
                      <Share2 className="size-4" />
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">Share</span>
                  </button>
                </aside>

                {/* Bottom Timeline Scrubber */}
                {isCurrent && activeDuration > 0 && (
                  <div
                    className="absolute inset-x-0 bottom-0 z-30 h-1.5 w-full cursor-pointer bg-stone-800/80 transition-all hover:h-2.5"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      const video = videoRefs.current[activeIndex];
                      if (video) {
                        video.currentTime = clickPos * activeDuration;
                        setActiveCurrentTime(video.currentTime);
                      }
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100"
                      style={{
                        width: `${Math.min(100, (activeCurrentTime / activeDuration) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
