import { VideoMedia } from "@/ui/VideoMedia"
import type { FeedBlock } from "@/lib/site"

interface MediaPayloadProps {
  block: FeedBlock
  eager: boolean
}

function ImagePayload({ block, eager }: MediaPayloadProps) {
  if (!block.mediaUrl) return null

  return (
    <div className="block-media block-media-image">
      <img
        src={block.mediaUrl}
        alt={block.mediaAlt ?? ""}
        className="media-image"
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  )
}

function GridPayload({ block }: MediaPayloadProps) {
  const urls = block.mediaUrls ?? []

  if (urls.length === 0) return null

  const count = Math.min(4, urls.length)

  const ratio = block.gridAspectRatio ?? "1/1"

  return (
    <div
      className={`block-media block-media-grid grid-count-${count}`}
      style={{ "--grid-aspect": ratio } as React.CSSProperties}
    >
      {urls.slice(0, count).map((url, index) => (
        <div key={index} className="grid-cell">
          <img
            src={url}
            alt={block.mediaAlt ?? ""}
            className="grid-image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}

// Chooses the payload renderer from the block's media_type
export function MediaPayload({ block, eager }: MediaPayloadProps) {
  if (block.mediaType === "video" && block.mediaUrl) {
    return (
      <VideoMedia
        src={block.mediaUrl}
        poster={block.mediaPosterUrl}
        alt={block.mediaAlt}
      />
    )
  }

  if (block.mediaType === "grid") {
    return <GridPayload block={block} eager={eager} />
  }

  return <ImagePayload block={block} eager={eager} />
}
