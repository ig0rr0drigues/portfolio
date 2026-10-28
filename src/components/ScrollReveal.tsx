'use client'

import { useEffect } from 'react'

/*
  Faz os elementos com a classe "reveal" aparecerem suavemente quando entram na tela.
  - Funciona também nas páginas abertas pela navegação interna (observa o que entra na página).
  - Cada elemento anima uma vez só.
  - Quem prefere menos movimento (configuração do sistema) vê tudo sem animação:
    o script do layout nem liga o modo de animação nesse caso.
*/
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('has-reveal')) return
    ;(window as unknown as { __revealReady?: boolean }).__revealReady = true

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    const scan = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not([data-revealing])').forEach((el) => {
        el.setAttribute('data-revealing', '')
        io.observe(el)
      })
    }
    scan()

    // Conteúdo novo (troca de página, idioma) entra na observação automaticamente.
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}

/*
  Script que roda antes da página aparecer: liga o modo de animação só se o navegador suporta
  e se a pessoa não pediu menos movimento. Se o JavaScript do site falhar em carregar,
  desliga o modo depois de 2,5 s, para nada ficar escondido.
*/
export const revealBootScript = `(function(){try{
var d=document.documentElement;
if(!('IntersectionObserver' in window))return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('has-reveal');
setTimeout(function(){if(!window.__revealReady)d.classList.remove('has-reveal')},2500);
}catch(e){}})();`
