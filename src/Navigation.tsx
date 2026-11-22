import { useEffect, useRef, useState, type MouseEvent } from 'react'
import './navigation.css'

const sections = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Lívia Avelar' },
  { href: '#tratamentos', label: 'Tratamentos' },
  { href: '#metodo', label: 'A abordagem' },
  { href: '#clinica', label: 'A clínica' },
  { href: '#caderno', label: 'Caderno' },
  { href: '#agendar', label: 'Contato' },
]

const inlineLinks = sections.filter(({ href }) =>
  ['#sobre', '#tratamentos', '#clinica'].includes(href),
)

const menuExitDuration = 280

function Wordmark() {
  return (
    <>
      <span className="jn-wordmark__symbol" aria-hidden="true">LA</span>
      <span className="jn-wordmark__name">Lívia Avelar</span>
    </>
  )
}

export function Navigation({
  appointmentHref,
  portraitSrc,
}: {
  appointmentHref: string
  portraitSrc?: string
}) {
  const menu = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  function openMenu() {
    const dialog = menu.current
    if (!dialog || dialog.open) return

    dialog.showModal()
    dialog.scrollTop = 0
    setIsOpen(true)
    closer.current?.focus({ preventScroll: true })
  }

  function closeMenu(href?: string) {
    if (!menu.current?.open || closeTimer.current !== undefined) return

    const finish = () => {
      closeTimer.current = undefined
      menu.current?.close()
      setIsOpen(false)
      setIsClosing(false)

      if (!href) {
        opener.current?.focus({ preventScroll: true })
        return
      }

      window.location.assign(href)
    }

    if (document.documentElement.dataset.motion !== 'full') {
      finish()
      return
    }

    setIsClosing(true)
    closeTimer.current = window.setTimeout(finish, menuExitDuration)
  }

  function followMenuLink(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    closeMenu(event.currentTarget.href)
  }

  return (
    <header className="jn-header">
      <div className="jn-header__inner">
        <a className="jn-wordmark" href="#inicio" aria-label="Lívia Avelar, início">
          <Wordmark />
        </a>

        <nav className="jn-header__nav" aria-label="Navegação principal">
          {inlineLinks.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <div className="jn-header__actions">
          <a className="jn-appointment" href={appointmentHref}>Agendar avaliação</a>
          <button
            ref={opener}
            type="button"
            className="jn-menu-button"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-controls="jn-fullscreen-menu"
            aria-expanded={isOpen}
            onClick={openMenu}
          >
            <span className="jn-menu-icon" aria-hidden="true" />
            <span className="jn-menu-button__label">Menu</span>
          </button>
        </div>
      </div>

      <dialog
        id="jn-fullscreen-menu"
        ref={menu}
        className="jn-menu"
        data-closing={isClosing || undefined}
        aria-label="Menu da clínica"
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
      >
        <div className="jn-menu__top">
          <a className="jn-wordmark" href="#inicio" aria-label="Lívia Avelar, início" onClick={followMenuLink}>
            <Wordmark />
          </a>
          <button ref={closer} type="button" className="jn-menu-button" onClick={() => closeMenu()} aria-label="Fechar menu">
            <span className="jn-menu-icon jn-menu-icon--close" aria-hidden="true" />
            <span className="jn-menu-button__label">Fechar</span>
          </button>
        </div>

        <div className="jn-menu__body">
          <div className="jn-menu__paths">
            <nav className="jn-menu__links" aria-label="Seções do site">
              {sections.map(({ href, label }) => (
                <a key={href} href={href} onClick={followMenuLink}>
                  <span className="jn-menu__line">
                    <span className="jn-menu__line-text">{label}</span>
                  </span>
                </a>
              ))}
            </nav>
            <a className="jn-appointment jn-appointment--menu" href={appointmentHref} onClick={followMenuLink}>
              Agendar avaliação
            </a>
          </div>

          <div className="jn-menu__visual" aria-hidden="true">
            {portraitSrc ? <img src={portraitSrc} alt="" loading="lazy" /> : <span>LA</span>}
          </div>
        </div>
      </dialog>
    </header>
  )
}

