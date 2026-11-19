import Image from 'next/image'
import { YouTubeVideo } from '@/lib/youtube-feed'
import { PlayDisc, SectionTitle, formatDate } from './site-ui'

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a className="vcard card" href={video.url} target="_blank" rel="noopener noreferrer">
      <div className="thumb">
        <Image src={video.thumbnail} alt={video.title} fill sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 33vw" />
        <PlayDisc />
      </div>
      <h3>{video.title}</h3>
      {video.description && <p>{video.description}</p>}
      {video.publishedAt && <span className="date">{formatDate(video.publishedAt, { month: 'short', year: 'numeric' })}</span>}
    </a>
  )
}

export default function InterviewGrid({ videos, num }: { videos: YouTubeVideo[]; num: string }) {
  return (
    <>
      <SectionTitle
        id="interviews"
        num={num}
        eyebrow="Toutes les vidéos"
        action={
          <a className="btn i-ext" href="https://www.youtube.com/channel/UCbfucDBGTg_qarA8qJpMe-A" target="_blank" rel="noopener noreferrer">
            Voir la chaîne YouTube
          </a>
        }
      >
        Le catalogue Spark
      </SectionTitle>
      <div className="vgrid">
        {videos.map((video) => <VideoCard key={video.id} video={video} />)}
      </div>
    </>
  )
}
