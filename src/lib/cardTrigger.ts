/*
  Quando o vídeo de capa de um card deve tocar.
  - Com mouse: enquanto o mouse está sobre o card (ou ele tem o foco do teclado).
  - Em telas de toque: enquanto o card passa pelo centro da tela, rolando a página.
  - Desligado para quem prefere menos movimento e, no toque, para quem ativou a economia de dados.
*/
export type TriggerMode = 'hover' | 'center'

export function videoMode(): TriggerMode | null {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return 'hover'
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return null
  return 'center'
}

export function bindCardTrigger(card: HTMLElement, enter: () => void, leave: () => void, mode: TriggerMode): () => void {
  if (mode === 'hover') {
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('focus', enter)
    card.addEventListener('blur', leave)
    return () => {
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('focus', enter)
      card.removeEventListener('blur', leave)
    }
  }

  // Faixa central da tela (20% da altura): o card que passa por ela toca.
  let inside = false
  const io = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (hit && !inside) {
        inside = true
        enter()
      } else if (!hit && inside) {
        inside = false
        leave()
      }
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  )
  io.observe(card)
  return () => io.disconnect()
}
