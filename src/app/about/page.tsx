"use client";

import { useEffect, useState, useRef } from "react";
import { offices } from "@/data/offices";

export default function About() {
  const [activeSegment, setActiveSegment] = useState(0);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const selectedOfficeRef = useRef<any>(null);

  // 常に最新のステートを Ref に同期（イベントリスナー用）
  useEffect(() => {
    selectedOfficeRef.current = selectedOffice;
  }, [selectedOffice]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalScrollable = document.documentElement.scrollHeight - windowHeight;
      const scrollPercent = scrollY / totalScrollable;
      const nextSegment = Math.min(Math.floor(scrollPercent * 3), 2);
      setActiveSegment(nextSegment);
    };

    const handleOfficeClick = (e: any) => {
      if (selectedOfficeRef.current && selectedOfficeRef.current.name !== e.detail.name) {
        setIsVisible(false);
        setTimeout(() => {
          setSelectedOffice(e.detail);
          setIsVisible(true);
        }, 800);
      } else {
        setSelectedOffice(e.detail);
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("office-click", handleOfficeClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("office-click", handleOfficeClick);
    };
  }, []);

  const content = [
    {
      title: "Corporate Profile",
      subtitle: "会社概要",
      description: "私たちは最新のテクノロジーとデザインを融合させ、ビジネスの未来を創造するデジタルクリエイティブカンパニーです。",
      details: [
        { label: "名称", value: "BST株式会社" },
        { label: "代表取締役", value: "上野 俊行" },
        { label: "設立", value: "2018年8月17日" },
        { label: "取引銀行", value: "楽天銀行" },
      ],
      services: [
        "ウェブサイトの企画、設計、開発、保守、運営及び販売",
        "情報技術による事業の開発、構築及びコンサルティング業務",
        "デザイン、映像、催事の企画、立案及び制作業務"
      ]
    }
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden pointer-events-none">
      <div className="relative z-10 max-w-7xl mx-auto px-8 h-full">
        <section className="flex flex-col items-start justify-center w-full h-full">
          <div
            className={`w-full lg:w-1/2 relative h-[600px] flex items-center pointer-events-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            {/* Office Detail View (Appears on Pin Click) */}
            {selectedOffice ? (
              <div className="glass-panel p-8 rounded-2xl text-left shadow-2xl border-l-[6px] border-accent animate-fade-in-up w-full max-w-xl">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">
                    Office Network
                  </span>
                  <button
                    onClick={() => {
                      setSelectedOffice(null);
                      window.dispatchEvent(new CustomEvent('office-reset'));
                    }}
                    className="text-black/100 hover:text-accent transition-colors text-sm flex items-center gap-1 cursor-pointer border-[1px] border-accent py-2 px-4 rounded-full bg-white/100"
                  >
                    <span>←</span> Back to Profile
                  </button>
                </div>

                <h2 className="text-3xl font-bold mb-2">{selectedOffice.name}</h2>
                <div className="w-12 h-1 bg-accent/30 mb-6" />

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full border border-accent/30 flex items-center justify-center flex-shrink-0 text-[10px] text-accent">住</div>
                    <div className="flex-1">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Address</p>
                      <p className="text-base leading-relaxed">{selectedOffice.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <a
                    href={selectedOffice.mapUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent text-[#112f4f] font-bold py-3 px-4 rounded text-center text-sm hover:opacity-90 transition-opacity"
                  >
                    View on Google Maps
                  </a>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-[10px] uppercase tracking-wider mb-3 text-accent">Jump to other offices</p>
                  <div className="flex flex-wrap gap-2">
                    {offices.filter(o => o.name !== selectedOffice.name).map(office => (
                      <button
                        key={office.id}
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('office-switch', { detail: { name: office.name } }));
                          if (selectedOffice) {
                            setIsVisible(false);
                            setTimeout(() => {
                              setSelectedOffice(office);
                              setIsVisible(true);
                            }, 800);
                          } else {
                            setSelectedOffice(office);
                            setIsVisible(true);
                          }
                        }}
                        className="py-1.5 px-3 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-all text-xs"
                      >
                        {office.name.split('（')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Global Profile View (Original Content) */
              <div
                className="animate-fade-in-up w-full"
              >
                <div className="glass-panel p-10 rounded-2xl text-left shadow-2xl border-l-[6px] border-accent max-w-xl">
                  <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">
                    {content[0].title}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 whitespace-pre-wrap leading-tight">{content[0].subtitle}</h2>
                  <p className="text-sm opacity-60 leading-relaxed mb-2 border-b border-white/10 pb-6">{content[0].description}</p>

                  <div className="space-y-4 mb-2">
                    {content[0].details.map((detail, i) => (
                      <div key={i} className="flex items-center text-sm border-b border-white/5 pb-2">
                        <span className="w-24 text-accent text-[16px] font-bold uppercase tracking-wider">{detail.label}</span>
                        <span className="text-white/90">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-5">
                    <p className="text-accent text-[16px] font-bold tracking-[0.2em] mb-1 uppercase">主たる業務</p>
                    <div className="space-y-2">
                      {content[0].services.map((service, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs text-white/70 leading-relaxed">
                          <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <p className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Jump to Office</p>
                    <div className="flex flex-wrap gap-2">
                      {offices.map((office) => (
                        <button
                          key={office.id}
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('office-switch', { detail: { name: office.name } }));
                            if (selectedOffice) {
                              setIsVisible(false);
                              setTimeout(() => {
                                setSelectedOffice(office);
                                setIsVisible(true);
                              }, 800);
                            } else {
                              setSelectedOffice(office);
                              setIsVisible(true);
                            }
                          }}
                          className="py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all text-sm font-medium"
                        >
                          {office.name.split('（')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
