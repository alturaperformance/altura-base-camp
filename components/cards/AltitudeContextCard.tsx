import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'

interface AltitudeContextCardProps {
  homeElevationFt: number
  title: string
  body: string
}

export function AltitudeContextCard({ homeElevationFt, title, body }: AltitudeContextCardProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Your altitude context
      </p>
      <Card>
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Today&apos;s altitude insight
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-3">{body}</p>
        <Pill variant="teal">{homeElevationFt.toLocaleString()} ft</Pill>
      </Card>
    </div>
  )
}
