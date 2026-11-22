import { useEffect, useId, useRef, useState } from 'react'
import './approach.css'

const steps = [
  {
    title: 'Escuta e avaliação',
    copy: 'A consulta começa com uma conversa sobre o que você quer cuidar, seu histórico e suas expectativas. A avaliação facial ajuda a entender movimentos, proporções e características do seu rosto.',
  },
  {
    title: 'Planejamento individual',
    copy: 'Se houver indicação, a clínica conversa com você sobre opções, limites, riscos e recuperação. A avaliação também pode indicar adiar ou dispensar um procedimento.',
  },
  {
    title: 'Orientação e acompanhamento',
    copy: 'As orientações e a necessidade de retorno dependem do procedimento indicado. A consulta também é o momento de entender como será o acompanhamento.',
  },
]

const features = [
  {
    stroke: 'M239 248C255 235 279 234 295 244M241 265C255 252 278 252 293 263C275 273 257 273 245 269M266 256C262 260 264 268 271 269C278 270 281 264 280 259',
    leader: 'M237 246H209L187 224H129',
    point: [129, 224],
  },
  {
    stroke: 'M293 298C283 300 276 308 272 319C269 327 264 336 257 341M309 296C312 300 317 300 323 297M215 297C231 318 251 326 271 324',
    leader: 'M327 284H363L385 262H432',
    point: [432, 262],
  },
  {
    stroke: 'M296 331C308 333 311 326 317 328C322 328 327 332 330 332M299 333C306 340 316 345 324 339M198 345C214 366 233 379 256 381',
    leader: 'M229 372H202L174 389H130',
    point: [130, 389],
  },
]

function FaceStudy({ active }: { active: number }) {
  const figureId = useId()

  return (
    <svg className="approach-drawing" viewBox="0 0 500 530" fill="none" aria-hidden="true" focusable="false">
      <defs>
        {features.map((feature, index) => <path id={`${figureId}-line-${index}`} key={feature.stroke} pathLength="1" d={feature.stroke} />)}
      </defs>
      <g className="approach-guides">
        <circle className="approach-guide-orbit" cx="250" cy="250" r="170" pathLength="1" />
        <circle className="approach-guide-orbit approach-guide-orbit-outer" cx="250" cy="250" r="213" pathLength="1" />
        <path className="approach-guide-grid" d="M23 250H476M250 21V485M82 141H419M82 359H419" />
        <path d="M31 244V256M25 250H37M463 244V256M457 250H469M244 38H256M250 32V44M244 463H256M250 457V469" className="approach-crosses" />
      </g>
      <g className="approach-contour">
        <path className="approach-trace approach-trace-silhouette" pathLength="1" d="M178 267C157 254 157 274 161 289C163 305 174 322 188 323C191 355 206 379 227 393C244 406 268 414 286 407C305 399 313 378 323 358C328 348 331 339 331 332C329 328 326 325 326 319C326 312 339 305 350 305C357 305 359 301 355 295C345 279 334 268 330 255C326 241 329 229 329 215C330 180 315 155 295 140" />
        <path className="approach-trace approach-trace-hair" pathLength="1" d="M161 270C138 246 130 206 138 172C148 129 183 101 236 101C289 101 321 124 336 153C313 143 297 142 281 144C264 146 249 157 237 170C220 189 215 205 203 216C188 230 178 234 178 267" />
        <path className="approach-trace approach-trace-neck" pathLength="1" d="M91 487C129 469 170 459 188 435C197 423 202 401 198 375M181 502C190 472 214 450 249 436C270 428 287 414 293 390" />
        <path className="approach-trace approach-trace-detail" pathLength="1" d="M138 207C135 172 151 141 184 125C216 109 251 113 273 121C249 123 228 132 213 144C195 158 190 180 177 194C165 204 155 208 138 207M173 277C181 278 185 283 185 291M169 295C176 303 181 301 185 297" />
      </g>
      {features.map((feature, index) => (
        <g className="approach-feature" data-active={active === index} key={feature.leader}>
          <use className="approach-feature-base" href={`#${figureId}-line-${index}`} />
          <use className="approach-feature-accent" href={`#${figureId}-line-${index}`} />
          <path className="approach-annotation" pathLength="1" d={feature.leader} />
          <circle className="approach-point-ring" cx={feature.point[0]} cy={feature.point[1]} r="9" />
          <circle className="approach-point" cx={feature.point[0]} cy={feature.point[1]} r="3" />
        </g>
      ))}
    </svg>
  )
}

export function Approach() {
  const track = useRef<HTMLDivElement>(null)
  const figure = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [drawing, setDrawing] = useState<'static' | 'ready' | 'drawn'>('static')

  useEffect(() => {
    const items = track.current?.querySelectorAll<HTMLElement>('[data-approach-step]')
    const artwork = figure.current
    if (!items?.length || !artwork || !('IntersectionObserver' in window)) return

    setDrawing('ready')
    const drawingObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setDrawing('drawn')
      drawingObserver.disconnect()
    }, { threshold: 0.15 })

    let stepObserver: IntersectionObserver | undefined
    let resizeFrame = 0

    const observeSteps = () => {
      stepObserver?.disconnect()
      // Keep the reading line at the same relative height in both orientations.
      const viewportHeight = document.documentElement.clientHeight
      const readingLine = Math.round(viewportHeight * 0.55)
      stepObserver = new IntersectionObserver(() => {
        let visibleIndex = 0
        items.forEach((item, index) => {
          if (item.getBoundingClientRect().top <= readingLine) visibleIndex = index
        })
        setActive(visibleIndex)
      }, { rootMargin: `-${readingLine}px 0px -${Math.max(0, viewportHeight - readingLine - 2)}px` })

      items.forEach((item) => stepObserver?.observe(item))
    }

    const resize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(observeSteps)
    }

    drawingObserver.observe(artwork)
    observeSteps()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(resizeFrame)
      drawingObserver.disconnect()
      stepObserver?.disconnect()
    }
  }, [])

  return (
    <section className="approach" id="metodo" aria-labelledby="approach-title">
      <div className="approach-shell">
        <div className="approach-header">
          <p className="approach-kicker">A abordagem</p>
          <h2 id="approach-title">O cuidado começa<br /><em>pela avaliação.</em></h2>
        </div>
        <div className="approach-layout">
          <figure className="approach-figure" ref={figure} data-drawing={drawing}>
            <FaceStudy active={active} />
            <figcaption>Ilustração conceitual das proporções faciais</figcaption>
          </figure>
          <div className="approach-track" ref={track}>
            {steps.map((step, index) => (
              <article className="approach-step" data-approach-step={index} data-current={active === index} data-passed={active > index} key={step.title}>
                <div className="approach-step-meta" aria-hidden="true">
                  <span className="approach-step-number">0{index + 1}</span>
                </div>
                <div className="approach-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

