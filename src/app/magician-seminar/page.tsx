'use client'

import React, { useState, useEffect } from 'react'
import MagicianScene from '@/components/canvas/MagicianScene'

export default function MagicianSeminarPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement
      const b = document.body
      const st = 'scrollTop'
      const sh = 'scrollHeight'
      const progress = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="relative w-full bg-black overflow-x-hidden" style={{ height: '700vh' }}>
      <MagicianScene progress={scrollProgress} />

      <div className="relative z-10 w-full">
        {/* Scene 1: Hero */}
        <section className="w-full h-screen flex items-center justify-center p-10 pointer-events-none">
          <div className="max-w-4xl text-center">
            <span className="text-[#c3c14e] font-bold tracking-[0.3em] uppercase text-sm mb-4 block animate-pulse">Transformation Seminar</span>
            <h1 className="text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
              思考の<br />ブレイクスルー講座
            </h1>
            <div className="w-20 h-1 bg-[#c3c14e] mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
               固定観念や先入観を取り除いて、思考の壁を突破しましょう！
            </p>
          </div>
        </section>

        {/* Scene 2: The Test */}
        <section className="w-full h-screen flex items-center justify-start px-32 p-10 pointer-events-none">
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
              心の中でカードを<br />1枚選んでください
            </h2>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              数字とマークを、頭の中で鮮明に浮かべてください。<br />
              日常は、このような些細な思い込みの連続です。その思い込みを解き放つ体験を。
            </p>
          </div>
        </section>

        {/* Scene 3: The Reveal */}
        <section className="w-full h-screen flex items-center justify-center text-center p-10 pointer-events-none">
          <div className="max-w-3xl">
            <h2 className="text-6xl font-black text-[#c3c14e] mb-8 italic tracking-tighter">
              BREAKTHROUGH
            </h2>
            <p className="text-2xl text-white font-bold mb-4">
              実は、全部のカードが入れ替わっていました
            </p>
            <p className="text-lg text-gray-400 font-light">
              「自分の選んだカードだけが消えた」という思い込みが、<br />
              真実を見えなくさせていたのです。これが思考の壁（固定観念）です。
            </p>
          </div>
        </section>

        {/* Scene 4: Benefits (研修の内容) */}
        <section className="w-full h-screen flex items-center justify-end px-32 p-10 pointer-events-none">
          <div className="max-w-3xl text-right">
            <h2 className="text-4xl font-bold text-white mb-12 underline decoration-[#c3c14e] underline-offset-8">
              研修の内容
            </h2>
            <div className="grid gap-10 text-white">
              <div>
                <h3 className="text-2xl text-[#c3c14e] font-bold mb-3">01. 思考のブレイクスルーを体感</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  「できない」と思われる問題と答えを提示し、その後、類題を解くことで「できる」自分を実感。すぐに成長を実感できる構成です。
                </p>
              </div>
              <div>
                <h3 className="text-2xl text-[#c3c14e] font-bold mb-3">02. 営業マン時代の成功体験</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  大手デベロッパー時代の経験を元に、固定観念を打破することで成果を上げた実体験を語ります。ビジネスの現場で役立つ身近な話です。
                </p>
              </div>
              <div>
                <h3 className="text-2xl text-[#c3c14e] font-bold mb-3">03. マジシャンの思考解析</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  プロマジシャン独自の視点による「思考の裏側」を解説。徹底的に顧客満足に向き合うメソッドを、マジックを交えてお話しします。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 5: Testimonials (参加者の声) */}
        <section className="w-full h-screen flex items-center justify-center p-10 pointer-events-none">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl font-bold text-white mb-10 text-center uppercase tracking-widest">参加者の声</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scale-90">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                    <p className="text-gray-300 italic text-sm leading-loose">
                        「昨年お呼びした実績のある方より興味深く話を聞いていました。マジックを挟みつつ社員が参加できる講演だったので、笑いもありつつ最後まで興味を持って聞けました。」
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                    <p className="text-gray-300 italic text-sm leading-loose">
                        「大変分かりやすく、目でも楽しめるため飽きないセミナーでした。発想を持っていなかった部分に気づかされ、これが思考の壁なのかと実感しました。」
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                    <p className="text-gray-300 italic text-sm leading-loose">
                        「ほっしー☆さんの話し方や考え方がとても魅力的でした。普段あまり考えることがない事を言語化してくださり、たくさんの気づきがありました。」
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 flex items-center justify-center">
                    <p className="text-[#c3c14e] font-bold text-lg">
                        思考の壁を突破しましょう！
                    </p>
                </div>
            </div>
          </div>
        </section>

        {/* Scene 6: Profile (マジシャンプロフィール) */}
        <section className="w-full min-h-screen py-20 flex items-center justify-center p-10 pointer-events-none">
          <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[40px] border border-white/10 max-w-6xl shadow-2xl pointer-events-auto">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="w-full lg:w-1/3">
                <div className="relative mb-8">
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-800 to-black rounded-3xl overflow-hidden border border-white/10"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c3c14e]/20 rounded-full blur-3xl"></div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Hossy☆</h2>
                <span className="text-[#c3c14e] font-bold tracking-[0.4em] uppercase text-xs mb-8 block">Pro Magician</span>
                <div className="space-y-4 text-sm text-gray-400">
                    <p>● 法政大学法学部卒業</p>
                    <p>● 大手マンションデベロッパーにてトップセールスを記録。マジックのできる名物営業マンとして売上を伸ばす</p>
                    <p>● 「全日本クロースアップマジックコンテスト」史上最年少1位</p>
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-[#c3c14e] font-bold text-xl mb-6">Message</h3>
                <div className="text-gray-300 space-y-6 leading-relaxed font-light">
                    <p>
                        私はマジシャンとして、目の前で起こる驚きの瞬間を通じて、人々の思考や行動に新たな視点をもたらすことができます。マジックはただの「手品」ではなく、目に見える問題を解決するための「思考のトリック」にも似ているんです。
                    </p>
                    <p>
                        このセミナーでは「柔軟な思考」「発想の転換」「意外性を活かしたチームワーク」などをテーマに、マジックを使った体験型ワークショップで楽しく学んでいただけます。
                    </p>
                    <p className="text-white font-medium">
                        仕事に役立つ新しい視点を、私と一緒に発見しませんか？
                    </p>
                </div>
                
                <div className="mt-12 pt-12 border-t border-white/10">
                    <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">お申し込みまでの流れ</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { step: '01', title: 'お問い合わせ', desc: 'フォームから連絡' },
                            { step: '02', title: 'ヒアリング', desc: '内容の確認' },
                            { step: '03', title: 'お見積もり', desc: 'プラン提案' },
                            { step: '04', title: '実施確定', desc: 'セミナー開催' }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <span className="text-[#c3c14e] font-mono text-xl block mb-2">{item.step}</span>
                                <p className="text-white text-xs font-bold mb-1">{item.title}</p>
                                <p className="text-gray-500 text-[10px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="mt-12 w-full py-6 bg-[#c3c14e] hover:bg-white text-black font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(195,193,78,0.3)]">
                  お問い合わせはこちら
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
