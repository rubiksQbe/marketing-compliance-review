import { useEffect, type RefObject } from 'react'

/** Adds `.is-scrolling` while the element is scrolled so CSS can show subtle scrollbars. */
export function useAutoHideScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      el.classList.add('is-scrolling')
      clearTimeout(timer)
      timer = setTimeout(() => el.classList.remove('is-scrolling'), 700)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [ref])
}
