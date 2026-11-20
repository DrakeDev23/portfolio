import { Calendar, MapPin } from 'lucide-react'

const ROLE_COLORS = { Attendee: '#C4B5FD', Delegate: '#22D3EE', Speaker: '#FBBF24' }

export default function EventCard({ event, index, isActive, onClick }) {
  const title = event.title || event.name || 'Untitled Event'
  const description = event.description || event.desc || ''
  const role = event.role || event.badge || 'Attendee'
  const roleKey = Object.keys(ROLE_COLORS).find((name) => role.toLowerCase().includes(name.toLowerCase())) || 'Attendee'
  const image = event.image || event.img

  return (
    <article className="event-card" role="group" aria-roledescription="slide" aria-label={`${index + 1}: ${title}`} aria-current={isActive ? 'true' : undefined} onClick={onClick}>
      <div className="event-card-photo">
        {image ? <img src={image} alt={title} loading="lazy" /> : <div className="event-card-photo-fallback" />}
        <div className="event-card-photo-fade" />
        <span className="event-card-role" style={{ '--role-color': ROLE_COLORS[roleKey] }}><i aria-hidden="true" />{role}</span>
      </div>
      <div className="event-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="event-card-meta">
          <span><MapPin aria-hidden="true" />{event.location || 'Cebu City'}</span>
          <span><Calendar aria-hidden="true" />{event.date || ''}</span>
        </div>
      </div>
    </article>
  )
}
