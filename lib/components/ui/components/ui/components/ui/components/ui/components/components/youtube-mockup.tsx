export default function YouTubeMockup({ thumbnail, title, channel }: any) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm">
      <img src={thumbnail} alt="thumbnail" className="w-full aspect-video object-cover" />
      <div className="p-3 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-black text-sm line-clamp-2">{title || 'Video Title'}</h3>
          <p className="text-gray-600 text-xs">{channel || 'Channel Name'}</p>
        </div>
      </div>
    </div>
  )
}
