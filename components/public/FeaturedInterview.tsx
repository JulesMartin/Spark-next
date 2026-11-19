import Image from 'next/image'
import { YouTubeVideo } from '@/lib/youtube-feed'
import { PlayDisc, SectionTitle, formatDate } from './site-ui'

export default function FeaturedInterview({ video, num }: { video: YouTubeVideo | null; num: string }) {
  if (!video) return null

  return (
    <>
      <SectionTitle id="derniere-video" num={num}>Dernière vidéo</SectionTitle>
      <a className="feature deep rvb" href={video.url} target="_blank" rel="noopener noreferrer">
        <div className="media">
          <Image src={video.thumbnail} alt={video.title} fill sizes="(max-width: 960px) 100vw, 52vw" />
          <PlayDisc />
        </div>
        <div className="body">
          <h3>{video.title}</h3>
          {video.description && <p className="txt">{video.description}</p>}
          <div className="acts">
            <span className="btn big i-play">Regarder sur YouTube</span>
            {video.publishedAt && <span className="meta">{formatDate(video.publishedAt)}</span>}
          </div>
        </div>
      </a>
    </>
  )
}
