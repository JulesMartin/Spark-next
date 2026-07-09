'use client'

import { useEffect, useRef, useState } from 'react'
import { PHONE_COUNTRIES } from '@/lib/phone-country-codes'

type Variant = 'brutalist' | 'rounded'

export default function PhoneInput({
  value,
  onChange,
  dialCode,
  onDialCodeChange,
  variant,
  dark = false,
  required = true,
}: {
  value: string
  onChange: (value: string) => void
  dialCode: string
  onDialCodeChange: (dialCode: string) => void
  variant: Variant
  dark?: boolean
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isBrutalist = variant === 'brutalist'
  const border = isBrutalist ? '2px solid #000' : `1.5px solid ${dark ? 'rgba(255,255,255,.15)' : '#E9E9E9'}`
  const bg = isBrutalist ? '#fff' : dark ? 'rgba(255,255,255,.07)' : '#fff'
  const textColor = isBrutalist ? '#000' : dark ? '#fff' : '#1C1C1C'
  const radius = isBrutalist ? 0 : 10
  const fontFamily = isBrutalist ? 'var(--font-assistant)' : undefined
  const placeholderColor = isBrutalist ? 'rgba(0,0,0,.4)' : undefined

  const matchedCountry = PHONE_COUNTRIES.find((c) => c.dial === dialCode)
  const flag = matchedCountry?.flag ?? '🌐'

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 4,
          flexShrink: 0,
          background: bg,
          border,
          borderRight: 'none',
          borderTopLeftRadius: radius,
          borderBottomLeftRadius: radius,
          padding: '0 0 0 10px',
          fontFamily,
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1, alignSelf: 'center' }}>{flag}</span>
        <input
          type="text"
          inputMode="tel"
          aria-label="Indicatif téléphonique (modifiable)"
          value={dialCode}
          onChange={(e) => onDialCodeChange(e.target.value)}
          style={{
            width: 48,
            alignSelf: 'center',
            border: isBrutalist ? '1.5px solid rgba(0,0,0,.35)' : `1.5px solid ${dark ? 'rgba(255,255,255,.25)' : '#D8D6CE'}`,
            borderRadius: 4,
            outline: 'none',
            background: isBrutalist ? '#FCFCD0' : dark ? 'rgba(255,255,255,.1)' : '#F2F1EC',
            margin: '6px 0',
            padding: '6px 4px 6px 6px',
            fontSize: 14,
            fontWeight: 700,
            color: textColor,
            cursor: 'text',
            fontFamily,
          }}
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Choisir un indicatif dans la liste"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            background: 'none',
            border: 'none',
            borderLeft: '2.5px solid #000',
            cursor: 'pointer',
            padding: '0 8px',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 14,
              opacity: 0.6,
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms',
            }}
          >
            ▾
          </span>
        </button>
      </div>

      <input
        type="tel"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="6 12 34 56 78"
        className={placeholderColor ? 'placeholder:text-black/40' : undefined}
        style={{
          flex: 1,
          minWidth: 0,
          background: bg,
          border,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          padding: '12px 16px',
          fontSize: 14,
          color: textColor,
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily,
        }}
      />

      <div
        role="listbox"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: isBrutalist ? 4 : 6,
          width: 250,
          maxHeight: open ? 260 : 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'max-height 220ms ease, opacity 180ms ease, transform 180ms ease',
          background: isBrutalist ? '#fff' : dark ? '#1C1C1C' : '#fff',
          border,
          borderRadius: isBrutalist ? 0 : 10,
          boxShadow: isBrutalist ? '3px 3px 0 #1A1A1A' : '0 8px 24px rgba(0,0,0,.18)',
          zIndex: 20,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {PHONE_COUNTRIES.map((c) => (
          <button
            key={c.iso}
            type="button"
            role="option"
            aria-selected={c.dial === dialCode}
            onClick={() => {
              onDialCodeChange(c.dial)
              setOpen(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 12px',
              background:
                c.dial === dialCode
                  ? isBrutalist
                    ? '#FEE04F'
                    : dark
                      ? 'rgba(255,255,255,.08)'
                      : '#F2F1EC'
                  : 'transparent',
              border: 'none',
              textAlign: 'left',
              fontSize: 13,
              color: textColor,
              cursor: 'pointer',
              fontFamily,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>{c.flag}</span>
            <span style={{ flex: 1 }}>{c.name}</span>
            <span style={{ opacity: 0.6 }}>{c.dial}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
