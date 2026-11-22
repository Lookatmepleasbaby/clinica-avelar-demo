import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, Clock3, MapPin, Pause, Play, X } from 'lucide-react'
import { Approach } from './Approach'
import { ClinicGallery } from './ClinicGallery'
import { Navigation } from './Navigation'
import { useEditorialReveal, useMotionPreference } from './motion'
import './styles.css'
import './site-motion.css'

const address = 'Alameda Jardim de Bruma, 120'
const region = 'Vila Aurora · Cidade Modelo, SP'
const evaluationHref = '#agendar'
const imagePath = (file: string) => `${import.meta.env.BASE_URL}media/${file}`

const media = {
  hero: imagePath('editorial-hero.jpg'),
  cover: imagePath('retrato-capa.jpg'),
  portrait: imagePath('retrato.jpg'),
  clinic: imagePath('fachada.jpg'),
  reception: imagePath('recepcao.jpg'),
  details: imagePath('detalhes.jpg'),
  consultation: imagePath('consulta.jpg'),
}

const treatments = [
  {
    name: 'Harmonização facial',
    description: 'Uma avaliação das proporções e da expressão do seu rosto para conversar sobre o que você gostaria de valorizar e quais possibilidades fazem sentido para você.',
    image: media.hero,
    position: '64% 46%',
    caption: 'Imagem editorial ilustrativa',
  },
  {
    name: 'Toxina botulínica',
    description: 'Leve suas dúvidas sobre linhas de expressão à consulta. A avaliação é o momento de conversar sobre movimentos faciais, objetivos e possibilidades de tratamento.',
    image: media.portrait,
    position: '50% 29%',
    caption: 'Lívia Avelar',
  },
  {
    name: 'Preenchimento facial',
    description: 'Converse sobre as áreas que você gostaria de valorizar. A indicação, o produto e os cuidados são discutidos na avaliação, de acordo com seu caso.',
    image: media.hero,
    position: '83% 53%',
    caption: 'Imagem editorial ilustrativa',
  },
  {
    name: 'Bioestimuladores',
    description: 'Pergunte à profissional em quais situações esse tratamento pode ser considerado, como é feito o planejamento e o que é acompanhado ao longo do tempo.',
    image: media.reception,
    position: '50% 54%',
    caption: 'Recepção da clínica',
  },
  {
    name: 'Limpeza de pele',
    description: 'Um atendimento para conhecer as necessidades da sua pele, esclarecer as etapas do cuidado profissional e alinhar orientações para sua rotina.',
    image: media.clinic,
    position: '50% 52%',
    caption: 'Clínica Avelar',
  },
  {
    name: 'Secagem de vasinhos',
    description: 'A avaliação ajuda a entender sua queixa, verificar se há indicação e explicar como é feito o acompanhamento.',
    image: media.consultation,
    position: '50% 35%',
    caption: 'Sala de avaliação',
  },
]

const gallery = [
  { src: media.clinic, title: 'Entrada', position: '50% 50%', href: media.clinic },
  { src: media.reception, title: 'Recepção', position: '50% 50%', href: media.reception },
  { src: media.details, title: 'Detalhes do espaço', position: '50% 50%', href: media.details },
  { src: media.consultation, title: 'Sala de avaliação', position: '50% 50%', href: media.consultation },
]

const journal = [
  {
    type: 'Avaliação',
    title: 'O que conversar na primeira consulta?',
    description: 'Conte o que você busca e entenda as opções antes de decidir.',
    body: 'Explique o que levou você a procurar a clínica e o que gostaria de preservar na sua expressão. A consulta também é o momento de informar seu histórico. Se houver indicação, pergunte sobre os riscos, o produto utilizado, os cuidados e o retorno.',
    reference: 'https://www.gov.br/anvisa/pt-br/comunicacao/campanhas/estetica/procedimento-seguro',
    image: media.portrait, position: '50% 30%',
  },
  {
    type: 'Harmonização facial',
    title: 'Cada rosto pede um olhar diferente',
    description: 'Por que a avaliação começa pela sua expressão e pelos seus objetivos.',
    body: 'Uma avaliação começa pelas suas expectativas e pela forma como você se sente com seus traços. Leve suas dúvidas sobre as opções, os limites e o acompanhamento.',
    image: media.hero, position: '64% 46%',
  },
  {
    type: 'Cuidados com a pele',
    title: 'Quando conversar sobre uma limpeza de pele?',
    description: 'O que perguntar sobre cuidados profissionais e sua rotina em casa.',
    body: 'As características de cada pele orientam a conversa sobre cuidados. Durante a avaliação, conte quais produtos você usa e pergunte como o atendimento se relaciona com sua rotina e de quais cuidados você precisa depois.',
    image: media.clinic, position: '50% 54%',
  },
]

const photoPosition = (position: string) => ({ objectPosition: position })

function Hero({ animated, onMotionChange }: { animated: boolean; onMotionChange: () => void }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="kicker hero-kicker">Harmonização facial em Cidade Modelo</p>
          <h1 id="hero-title">
            <span className="title-line"><span>Seus traços. </span></span>
            <span className="title-line"><em>Seu equilíbrio.</em></span>
          </h1>
          <p className="hero-summary">Um plano de harmonização facial que começa com escuta e respeita o que dá expressão ao seu rosto.</p>
          <div className="hero-actions">
            <a className="button button-main" href={evaluationHref}>Agendar avaliação</a>
            <a className="inline-link" href="#metodo">Conhecer a abordagem</a>
          </div>
        </div>
        <figure className="hero-media">
          <div className="hero-image">
            <img src={media.cover} alt="Retrato ilustrativo de Lívia Avelar na clínica" fetchPriority="high" width="1536" height="1024" />
          </div>
          <figcaption>Lívia Avelar · Cidade Modelo, SP</figcaption>
        </figure>
      </div>
      <div className="hero-footer">
        <a href="#sobre"><ArrowDown size={17} aria-hidden="true" /> Explore a clínica</a>
        <button className="motion-control" type="button" onClick={onMotionChange}>
          {animated ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {animated ? 'Reduzir animações' : 'Ver animações'}
        </button>
      </div>
    </section>
  )
}

function Profile() {
  return (
    <section className="profile wrap section-space" id="sobre" aria-labelledby="profile-title">
      <div className="profile-intro" data-reveal="rise">
        <p className="kicker">Quem cuida de você</p>
        <h2 id="profile-title">Lívia <em>Avelar</em></h2>
        <p>Lívia Avelar lidera um espaço dedicado à estética facial, com atenção à expressão e às expectativas de cada pessoa.</p>
      </div>
      <figure className="profile-media">
        <div className="profile-image" data-reveal="mask">
          <img src={media.portrait} alt="Retrato ilustrativo de Lívia Avelar" loading="lazy" width="1122" height="1402" />
        </div>
        <figcaption>Lívia Avelar · Cidade Modelo, SP</figcaption>
      </figure>
      <div className="profile-story">
        <div className="profile-chapter" data-reveal="rise">
          <h3>O tempo da primeira conversa</h3>
          <p>A primeira conversa é um espaço para contar o que você gostaria de cuidar, revisar seu histórico e perguntar sobre indicação, etapas e acompanhamento.</p>
        </div>
        <div className="profile-chapter" data-reveal="rise">
          <h3>Plano Avelar</h3>
          <p>O Plano Avelar organiza as prioridades conversadas na avaliação. Cada etapa fica registrada para que você saiba o que está previsto e possa decidir com calma.</p>
        </div>
      </div>
    </section>
  )
}

function Treatments() {
  const [{ active, previous }, setSelection] = useState({ active: 0, previous: -1 })

  return (
    <section className="treatments section-space" id="tratamentos" aria-labelledby="treatment-title">
      <div className="wrap">
        <div className="section-head" data-reveal="rise">
          <div>
            <p className="kicker">Tratamentos</p>
            <h2 id="treatment-title">Cuidado com <em>propósito.</em></h2>
          </div>
          <p>Conheça as possibilidades e leve suas perguntas para uma avaliação individual.</p>
        </div>
        <div className="treatment-grid">
          <div className="treatment-list">
            {treatments.map((treatment, index) => (
              <div className="treatment-item" key={treatment.name} data-active={active === index}>
                <h3>
                  <button type="button" id={`treatment-trigger-${index}`} aria-expanded={active === index} aria-controls={`treatment-panel-${index}`} onClick={() => setSelection((current) => current.active === index ? current : { active: index, previous: current.active })}>
                    <span className="treatment-no">{String(index + 1).padStart(2, '0')}</span>
                    <span>{treatment.name}</span>
                    <span className="treatment-toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div className="treatment-panel" id={`treatment-panel-${index}`} aria-labelledby={`treatment-trigger-${index}`} aria-hidden={active !== index}>
                  <div className="treatment-body">
                    <p>{treatment.description}</p>
                    <a className="inline-link" href={evaluationHref} tabIndex={active === index ? 0 : -1}>Consultar avaliação</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <figure className="treatment-media" data-direction={active < previous ? 'back' : 'forward'} data-transitioned={previous !== -1}>
            {treatments.map((treatment, index) => (
              <div className="treatment-photo" key={treatment.name} data-current={active === index} data-previous={previous === index}>
                <img src={treatment.image} alt="" loading="lazy" style={photoPosition(treatment.position)} />
              </div>
            ))}
            <figcaption key={active}>{treatments[active].caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Journal() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [reading, setReading] = useState<(typeof journal)[number] | null>(null)

  useEffect(() => {
    if (reading && !dialog.current?.open) dialog.current?.showModal()
  }, [reading])

  return (
    <section className="journal wrap section-space" id="caderno" aria-labelledby="journal-title">
      <div className="section-head" data-reveal="rise">
        <div>
          <p className="kicker">Caderno da clínica</p>
          <h2 id="journal-title">Antes <em>de decidir.</em></h2>
        </div>
        <p>Perguntas para levar à avaliação e informações gerais sobre cuidados com a pele.</p>
      </div>
      <div className="journal-grid">
        {journal.map((item, index) => (
          <article className="journal-card" data-reveal="rise" key={item.title} style={{ '--delay': `${index * 85}ms` } as CSSProperties}>
            <button type="button" onClick={() => setReading(item)} aria-haspopup="dialog">
              <span className="journal-image"><img src={item.image} alt="" loading="lazy" width="720" height="510" style={photoPosition(item.position)} /></span>
              <span className="kicker">{item.type}</span>
              <span className="journal-title">{item.title}</span>
              <span className="journal-description">{item.description}</span>
              <span className="inline-link">Ler conteúdo</span>
            </button>
          </article>
        ))}
      </div>
      <dialog ref={dialog} className="journal-dialog" aria-labelledby="journal-dialog-title" onClose={() => setReading(null)}>
        {reading && (
          <div className="journal-dialog-body">
            <button className="icon-button close-article" type="button" aria-label="Fechar leitura" onClick={() => dialog.current?.close()}><X size={21} aria-hidden="true" /></button>
            <p className="kicker">{reading.type}</p>
            <h3 id="journal-dialog-title">{reading.title}</h3>
            <p>{reading.body}</p>
            <div className="journal-sources">
              {reading.reference && <a className="inline-link" href={reading.reference} target="_blank" rel="noreferrer">Guia da Anvisa</a>}
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="contact section-space" id="agendar" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div data-reveal="rise">
          <p className="kicker">Sua primeira consulta</p>
          <h2 id="contact-title">Vamos conversar <em>sobre você?</em></h2>
          <p>Veja como seria o primeiro passo para solicitar uma avaliação.</p>
          <button className="button button-main" type="button" onClick={() => setSubmitted(true)}>Simular agendamento</button>
          {submitted && <p className="booking-feedback" role="status">Solicitação simulada. Nenhum dado foi enviado.</p>}
        </div>
        <div className="contact-details">
          <div><MapPin size={22} aria-hidden="true" /><div><h3>Visite a clínica</h3><address>{address}<br />{region}</address><p>Endereço ilustrativo.</p></div></div>
          <div>
            <Clock3 size={22} aria-hidden="true" />
            <div>
              <h3>Horários da clínica</h3>
              <dl className="clinic-hours">
                <div><dt>Seg, qua e sex</dt><dd>9h às 18h</dd></div>
                <div><dt>Ter e qui</dt><dd>13h às 20h</dd></div>
                <div><dt>Sáb e dom</dt><dd>Fechado</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function App() {
  const { motion, toggleMotion } = useMotionPreference()
  useEditorialReveal(motion)

  return (
    <>
      <a className="skip-link" href="#inicio">Pular para o conteúdo</a>
      <Navigation appointmentHref="#agendar" portraitSrc={media.portrait} />
      <main>
        <Hero animated={motion === 'full'} onMotionChange={toggleMotion} />
        <Profile />
        <Treatments />
        <Approach />
        <ClinicGallery entries={gallery} />
        <Journal />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-in">
          <a href="#inicio" className="footer-brand">Lívia Avelar<span>Clínica de estética</span></a>
          <p>Projeto de portfólio · Dados e imagens fictícios</p>
        </div>
      </footer>
    </>
  )
}


