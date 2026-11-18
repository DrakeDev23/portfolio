import { useEffect, useRef, useState } from 'react'
import { useBackendWake } from '../hooks/useBackendWake'
import { useIntroSound } from '../hooks/useIntroSound'
import '../styles/loader.css'

const SCENE_MS = 3200

const FADE_OUT_MS = 500

const SCENES = [
  { text: 'Drake Gwapo' },
  { text: 'Fullstack-Developer' },
  { text: 'Student Security Researcher', glitch: true },
  { text: 'Linux Enthusiast', logos: true },
]
const FIRST_LOOP_SCENE = 1

const LOGOS = [
  {
    label: 'Arch Linux',
    color: '#ffffff',
    path: 'M11.39.605C10.376 3.092 9.764 4.72 8.635 7.132c.693.734 1.543 1.589 2.923 2.554-1.484-.61-2.496-1.224-3.252-1.86C6.86 10.842 4.596 15.138 0 23.395c3.612-2.085 6.412-3.37 9.021-3.862a6.61 6.61 0 01-.171-1.547l.003-.115c.058-2.315 1.261-4.095 2.687-3.973 1.426.12 2.534 2.096 2.478 4.409a6.52 6.52 0 01-.146 1.243c2.58.505 5.352 1.787 8.914 3.844-.702-1.293-1.33-2.459-1.929-3.57-.943-.73-1.926-1.682-3.933-2.713 1.38.359 2.367.772 3.137 1.234-6.09-11.334-6.582-12.84-8.67-17.74z',
  },
  {
    label: 'Kali Linux',
    color: '#ffffff',
    path: 'M12.778 5.943s-1.97-.13-5.327.92c-3.42 1.07-5.36 2.587-5.36 2.587s5.098-2.847 10.852-3.008zm7.351 3.095l.257-.017s-1.468-1.78-4.278-2.648c1.58.642 2.954 1.493 4.021 2.665zm.42.74c.039-.068.166.217.263.337.004.024.01.039-.045.027-.005-.025-.013-.032-.013-.032s-.135-.08-.177-.137c-.041-.057-.049-.157-.028-.195zm3.448 8.479s.312-3.578-5.31-4.403a18.277 18.277 0 0 0-2.524-.187c-4.506.06-4.67-5.197-1.275-5.462 1.407-.116 3.087.643 4.73 1.408-.007.204.002.385.136.552.134.168.648.35.813.445.164.094.691.43 1.014.85.07-.131.654-.512.654-.512s-.14.003-.465-.119c-.326-.122-.713-.49-.722-.511-.01-.022-.015-.055.06-.07.059-.049-.072-.207-.13-.265-.058-.058-.445-.716-.454-.73-.009-.016-.012-.031-.04-.05-.085-.027-.46.04-.46.04s-.575-.283-.774-.893c.003.107-.099.224 0 .469-.3-.127-.558-.344-.762-.88-.12.305 0 .499 0 .499s-.707-.198-.82-.85c-.124.293 0 .469 0 .469s-1.153-.602-3.069-.61c-1.283-.118-1.55-2.374-1.43-2.754 0 0-1.85-.975-5.493-1.406-3.642-.43-6.628-.065-6.628-.065s6.45-.31 11.617 1.783c.176.785.704 2.094.989 2.723-.815.563-1.733 1.092-1.876 2.97-.143 1.878 1.472 3.53 3.474 3.58 1.9.102 3.214.116 4.806.942 1.52.84 2.766 3.4 2.89 5.703.132-1.709-.509-5.383-3.5-6.498 4.181.732 4.549 3.832 4.549 3.832zM12.68 5.663l-.15-.485s-2.484-.441-5.822-.204C3.37 5.211 0 6.38 0 6.38s6.896-1.735 12.68-.717Z',
  },
  {
    label: 'Ubuntu',
    color: '#E95420',
    path: 'M17.61.455a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zM12.92.8C8.923.777 5.137 2.941 3.148 6.451a4.5 4.5 0 0 1 .26-.007 4.92 4.92 0 0 1 2.585.737A8.316 8.316 0 0 1 12.688 3.6 4.944 4.944 0 0 1 13.723.834 11.008 11.008 0 0 0 12.92.8zm9.226 4.994a4.915 4.915 0 0 1-1.918 2.246 8.36 8.36 0 0 1-.273 8.303 4.89 4.89 0 0 1 1.632 2.54 11.156 11.156 0 0 0 .559-13.089zM3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.908 4.908 0 0 1-2.915.358 11.1 11.1 0 0 0 7.991 6.698 11.234 11.234 0 0 0 2.422.249 4.879 4.879 0 0 1-.999-2.85 8.484 8.484 0 0 1-.836-.136 8.304 8.304 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41z',
  },
  {
    label: 'Linux',
    color: '#ffffff',
    path: 'M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z',
  },
]

function Headline({ children }) {
  return (
    <h1
      className={[
        'inline-block max-w-[16ch] px-2 pb-[0.12em]',
        'font-sans font-black tracking-tight leading-[1.05] text-balance',
        'text-[clamp(2.5rem,9vw,8rem)]',
        'bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent',
      ].join(' ')}
    >
      {children}
    </h1>
  )
}

function DistroLogos() {
  return (
    <ul className="mt-8 sm:mt-12 flex items-start justify-center gap-6 sm:gap-10 md:gap-14">
      {LOGOS.map((logo, i) => (
        <li
          key={logo.label}
          className="loader-logo flex flex-col items-center gap-2"
          style={{ '--delay': `${450 + i * 250}ms` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            fill={logo.color}
            aria-hidden="true"
            focusable="false"
          >
            <path d={logo.path} />
          </svg>
          <span className="font-mono text-[10px] sm:text-xs tracking-wide text-gray-400">
            {logo.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

function statusLine(status, attempts, elapsed) {
  if (status === 'ready') return ''
  if (status === 'failed') return '[FAIL] Server did not respond in time.'
  if (import.meta.env.PROD) return ''

  let message
  if (elapsed < 5) message = 'Pinging server...'
  else if (elapsed < 20) message = 'Free-tier server is waking up...'
  else if (elapsed < 45) message = 'Still booting, almost there...'
  else message = 'Taking longer than usual, still trying...'

  return `[ .. ] ${message} ping #${Math.max(attempts, 1)} · ${elapsed}s`
}

function srMessage(status) {
  if (status === 'ready') return 'Server online. Loading portfolio.'
  if (status === 'failed') return 'Server did not respond in time. Use the retry button to try again.'
  return 'Loading portfolio. Waking up the server, this can take up to a minute.'
}

export default function LoadingScreen({ apiUrl, onDone, onReady }) {
  const { status, attempts, elapsed, retry } = useBackendWake(apiUrl)

  const [sceneIndex, setSceneIndex] = useState(0)
  const [exiting, setExiting] = useState(false)

  const statusRef = useRef(status)
  const fullPassDoneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    statusRef.current = status
    onDoneRef.current = onDone
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (status === 'ready') onReadyRef.current?.()
  }, [status])

  useEffect(() => {
    if (exiting) return undefined
    const t = setTimeout(() => {
      const isLast = sceneIndex === SCENES.length - 1
      if (isLast) fullPassDoneRef.current = true

      if (fullPassDoneRef.current && statusRef.current === 'ready') {
        setExiting(true)
        return
      }
      setSceneIndex(isLast ? FIRST_LOOP_SCENE : sceneIndex + 1)
    }, SCENE_MS)
    return () => clearTimeout(t)
  }, [sceneIndex, exiting])

  const sound = useIntroSound({
    sceneIndex,
    sceneMs: SCENE_MS,
    glitch: Boolean(SCENES[sceneIndex].glitch),
    exiting,
    fadeOutMs: FADE_OUT_MS,
  })

  const tipRef = useRef(null)
  useEffect(() => {
    const tip = tipRef.current
    if (!tip) return undefined
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      const nearRightEdge = e.clientX > window.innerWidth - 190

      tip.style.transform = nearRightEdge
        ? `translate(${e.clientX - 14}px, ${e.clientY + 18}px) translateX(-100%)`
        : `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`
      tip.style.opacity = '1'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [sound.playing])

  useEffect(() => {
    if (!exiting) return undefined
    const t = setTimeout(() => onDoneRef.current?.(), FADE_OUT_MS)
    return () => clearTimeout(t)
  }, [exiting])

  const scene = SCENES[sceneIndex]
  const line = statusLine(status, attempts, elapsed)
  const progress = status === 'ready' ? 100 : Math.min(92, 92 * (1 - Math.exp(-elapsed / 22)))

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'loader-root fixed inset-0 z-[100] overflow-hidden',
        'flex flex-col items-center justify-center px-4 sm:px-8 text-center',
        'bg-gradient-to-b from-[#3b0d6e] to-black',
        sound.playing ? '' : 'cursor-pointer',
        exiting ? 'is-exiting' : '',
      ].join(' ')}
      style={{ '--scene-duration': `${SCENE_MS}ms` }}
    >
      <span className="sr-only">{srMessage(status)}</span>

      {!sound.playing && (
        <div ref={tipRef} aria-hidden="true" className="loader-cursor-tip">
          Click anywhere to turn on sound
        </div>
      )}

      <div
        aria-hidden="true"
        className="loader-corner-hint absolute right-4 top-4 sm:right-6 sm:top-6 flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-wide text-purple-300/80"
      >
        <span className={`loader-eq ${sound.playing ? 'is-playing' : ''}`}>
          <i /><i /><i /><i />
        </span>
        <span>{sound.playing ? 'sound on' : 'tap for sound'}</span>
      </div>

      <div aria-hidden="true" className="flex flex-col items-center">
        <div
          key={`scene-${sceneIndex}`}
          className={scene.glitch ? 'loader-glitch' : 'loader-scene'}
        >
          <Headline>{scene.text}</Headline>
          {scene.logos && <DistroLogos />}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex flex-col items-center gap-3 px-4">
        {status === 'failed' && (
          <button
            type="button"
            onClick={retry}
            className={[
              'rounded-md border border-[#a855f7]/60 bg-[#a855f7]/10 px-4 py-2',
              'font-mono text-xs sm:text-sm text-purple-200',
              'hover:bg-[#a855f7]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]',
              'transition-colors',
            ].join(' ')}
          >
            Retry connection
          </button>
        )}
        {line && (
          <p
            aria-hidden="true"
            className={[
              'font-mono text-[11px] sm:text-xs tracking-wide',
              status === 'failed' ? 'text-red-400' : 'text-purple-400',
            ].join(' ')}
          >
            {line}
          </p>
        )}
        {status !== 'failed' && (
          <div className="flex w-[min(78vw,360px)] items-center gap-3" aria-hidden="true">
            <div className="loader-meter-track flex-1">
              <div
                className={`loader-meter-fill ${status === 'ready' ? 'is-done' : ''}`}
                style={{ width: `${progress}%` }}
              >
                <div className="loader-meter-shimmer" />
                <span className="loader-meter-head" />
              </div>
            </div>
            <span className="w-10 text-right font-mono text-[11px] sm:text-xs tabular-nums text-purple-300">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
