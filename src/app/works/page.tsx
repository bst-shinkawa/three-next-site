export default function Works() {
  return (
    <main className="relative w-full">
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <section className="flex flex-col items-start justify-center w-full min-h-screen">
          <div className="glass-panel p-10 rounded-2xl max-w-xl text-left shadow-xl animate-fade-in-up">
            <span className="text-accent text-xs font-bold tracking-[0.5em] uppercase mb-4 block">Case Studies</span>
            <h1 className="text-5xl font-bold mb-8">Selected Works</h1>
            <p className="text-xl leading-relaxed opacity-80 mb-6">
              自社プロダクトからナショナルクライアントのプロジェクトまで。
              確かな技術とクリエイティブが結実した実績の一部をご紹介します。
            </p>
          </div>
        </section>

        <section className="flex flex-col items-start justify-center w-full min-h-[150vh] gap-32 py-32">
          {/* Work 01 */}
          <div className="glass-panel p-10 rounded-2xl max-w-lg animate-fade-in-up">
            <span className="text-accent/60 text-[10px] font-bold tracking-[0.2em] mb-2 block">SaaS Product</span>
            <h3 className="text-2xl font-bold mb-4">NOWAA</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              ウェブサイト運用を劇的に効率化する、自社開発のサポートツール。
              直感的な操作感と高度な分析機能を備え、多くの企業のウェブ戦略を支えています。
            </p>
          </div>

          {/* Work 02 */}
          <div className="glass-panel p-10 rounded-2xl max-w-lg animate-fade-in-up">
            <span className="text-accent/60 text-[10px] font-bold tracking-[0.2em] mb-2 block">System Development</span>
            <h3 className="text-2xl font-bold mb-4">TOYOTA Mobile Toilet</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              モビリティを通じた社会課題解決プロジェクトにおける
              ウェブサイトコーディングおよび複雑なCMS構築を担当。
            </p>
          </div>

          {/* Work 03 */}
          <div className="glass-panel p-10 rounded-2xl max-w-lg animate-fade-in-up">
            <span className="text-accent/60 text-[10px] font-bold tracking-[0.2em] mb-2 block">Web Renewal</span>
            <h3 className="text-2xl font-bold mb-4">Recruitment Solutions</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              数万人規模の動線設計が必要な大手求人サイトのリニューアルを完遂。
              UI/UXの抜本的な改善により、コンバージョン率を大幅に向上させました。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
