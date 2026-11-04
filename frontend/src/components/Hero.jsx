import { ChevronDown } from 'lucide-react'
import avatarImg from '../assets/images/avatar-hero.png'

const ANTON = "font-['Anton','Bebas_Neue','Oswald',sans-serif] font-normal uppercase"
const SERIF = "font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal"
const PORTRAIT_MASK =
  '[mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,black_55%,transparent_100%)] ' +
  '[-webkit-mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,black_55%,transparent_100%)]'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden lg:h-screen lg:min-h-[700px]"
      style={{ backgroundColor: '#090514' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            'radial-gradient(ellipse 42% 55% at 50% 58%, rgba(122,51,255,0.26) 0%, transparent 70%)',
            'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(180,51,255,0.14) 0%, transparent 70%)',
            'radial-gradient(ellipse 28% 32% at 50% 38%, rgba(192,132,252,0.10) 0%, transparent 70%)',
          ].join(','),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%237A33FF' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            'radial-gradient(ellipse 55% 65% at 50% 45%, transparent 30%, rgba(9,5,20,0.55) 72%, rgba(9,5,20,0.92) 100%)',
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col items-center px-6 pb-24 pt-24 md:px-12 lg:block lg:py-0">

        <p
          className={`${SERIF} relative z-0 -mb-14 flex items-end justify-center gap-3 whitespace-nowrap text-[clamp(3.5rem,8vw,8rem)] leading-none animate-load-fade lg:absolute lg:left-1/2 lg:top-[16%] lg:mb-0 lg:-translate-x-1/2 lg:gap-0`}
          style={{
            color: '#ece3ff',
            textShadow: '0 0 40px rgba(122, 51, 255, 0.35)',
            animationDelay: '0.25s',
          }}
        >
          <span>Hey,</span>
          <span aria-hidden="true" className="hidden w-[clamp(100px,11vw,180px)] shrink-0 lg:block" />
          <span>There</span>
        </p>

        <img
          src={avatarImg}
          alt="Portrait of Drake"
          draggable="false"
          className={`${PORTRAIT_MASK} pointer-events-none relative z-10 h-auto w-[min(86vw,420px)] select-none object-contain brightness-[0.8] contrast-[1.1] saturate-[0.85] animate-load-fade lg:absolute lg:bottom-0 lg:left-1/2 lg:h-[92%] lg:w-auto lg:max-w-none lg:-translate-x-1/2`}
          style={{ animationDelay: '0.15s' }}
        />

        <h1
          className={`${ANTON} relative z-20 -mt-16 text-center animate-load-fade-up lg:absolute lg:bottom-24 lg:left-12 lg:mt-0 lg:text-left min-[1500px]:bottom-10`}
          style={{ animationDelay: '0.35s' }}
        >
          <span
            className="mb-1 block text-[clamp(1.5rem,3vw,3rem)] leading-none tracking-normal"
            style={{ color: '#c4b5fd' }}
          >
            I am
          </span>{' '}
          <span
            className="block text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #7A33FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Drake
          </span>
        </h1>

        <div
          className="relative z-20 mt-6 flex flex-col-reverse items-center gap-4 text-center animate-load-fade-up lg:absolute lg:bottom-24 lg:right-12 lg:mt-0 lg:w-[300px] lg:flex-col lg:items-end lg:text-right min-[1500px]:bottom-10"
          style={{ animationDelay: '0.45s' }}
        >
          <p className="max-w-[260px] text-sm leading-relaxed text-white/70">
            Full-stack Developer and Student Security Researcher. I find vulnerabilities, run authorized pen tests, and build more secure systems.
          </p>
          <p
            className={`${ANTON} text-[clamp(1.75rem,3.4vw,3.5rem)] leading-[0.9]`}
            style={{ color: '#e9dfff' }}
          >
            <span className="block">Student</span>
            <span className="block">Security</span>
            <span className="block">Researcher</span>
          </p>
        </div>
      </div>

      <button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-gray-600 transition-colors hover:text-gray-400 animate-load-fade"
        style={{ animationDelay: '1.2s' }}
        aria-label="Scroll to About section"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  )
}
