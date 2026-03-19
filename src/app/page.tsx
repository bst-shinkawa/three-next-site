export default function Home() {
  return (
    <main className="relative w-full">
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Page 1: Hero */}
        <section className="flex flex-col items-start justify-center w-full min-h-screen">
          <div className="glass-panel p-10 rounded-2xl max-w-xl text-left shadow-xl animate-fade-in-up">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              BST Inc.
            </h1>
            <p className="text-xl md:text-2xl text-accent font-medium mb-8">
              プロフェッショナルな<br />ウェブ制作・システム開発集団
            </p>
            <p className="text-md md:text-lg leading-relaxed text-opacity-80 mb-8 border-l-4 border-accent pl-6">
              数百のウェブサイト・システム構築を成功させてきた専門家たちが、
              クライアントの課題解決に向けて最適なデジタル戦略を提案・実行します。
            </p>
          </div>
          
          <div className="absolute bottom-10 left-8 animate-bounce">
            <div className="w-px h-24 bg-accent/40 mx-auto mb-4"></div>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 [writing-mode:vertical-rl]">Scroll Down</p>
          </div>
        </section>

        {/* Page 2: Strategy */}
        <section className="flex flex-col items-start justify-center w-full min-h-screen">
          <div className="glass-panel p-12 rounded-2xl max-w-xl animate-fade-in-up">
            <span className="text-accent text-xs font-bold tracking-[0.5em] uppercase mb-4 block">01 Strategy</span>
            <h2 className="text-4xl font-bold mb-6">最適なビジネスプラン</h2>
            <p className="leading-relaxed text-lg mb-6">
              私たちは単なる受託開発ではありません。
              クライアントのビジネスの核心を理解し、ウェブ・システム・クリエイティブの
              三つの柱から多角的なソリューションを構築します。
            </p>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                ウェブサイトの企画・設計・開発・運営
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                情報技術による新規事業開発コンサルティング
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                映像・催事の企画制作業務
              </li>
            </ul>
          </div>
        </section>

        {/* Page 3: Professionalism */}
        <section className="flex flex-col items-start justify-center w-full min-h-screen">
          <div className="glass-panel p-12 rounded-2xl max-w-xl bg-opacity-90 animate-fade-in-up">
            <span className="text-accent text-xs font-bold tracking-[0.5em] uppercase mb-4 block">02 Expertise</span>
            <h2 className="text-4xl font-bold mb-6">技術とデザインの融合</h2>
            <p className="leading-relaxed text-lg mb-6">
              先進的なテクノロジーと洗練された表現を組み合わせ、
              ビジネスの価値を最大化するデジタル体験を創造します。
              確かな技術力が、革新的なデザインに命を吹き込みます。
            </p>
            <div className="p-4 bg-white/20 rounded-lg text-sm italic">
              "数百のプロジェクトで培った知見が、あなたのビジネスを次のステージへ。"
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
