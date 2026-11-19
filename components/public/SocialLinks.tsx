import { SocialIcon } from './Footer'
import { YOUTUBE_URL } from './site-ui'

const SOCIALS = [
  { name: 'Instagram', label: 'jules_api', href: 'https://www.instagram.com/Z-Start-Web', icon: SocialIcon.instagram(28) },
  { name: 'TikTok', label: 'jules_api', href: 'https://www.tiktok.com/@Z-Start-Web', icon: SocialIcon.tiktok(26) },
  { name: 'YouTube', label: 'jules_api', href: YOUTUBE_URL, icon: SocialIcon.youtube(30) },
]

export default function SocialLinks() {
  return (
    <ul className="socials" aria-label="Réseaux sociaux">
      {SOCIALS.map(({ name, label, href, icon }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            <span className="tile">{icon}</span>
            <span><b>{name}</b><small>{label}</small></span>
          </a>
        </li>
      ))}
    </ul>
  )
}
