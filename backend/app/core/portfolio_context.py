def build_portfolio_context(events, projects, skills: dict) -> str:
    skills_text = "\n".join(
        f"- {category}: {', '.join(names)}"
        for category, names in skills.items()
    )

    projects_text = "\n".join(
        f"{i}. {p.title} — {p.desc} Tech: {', '.join(p.tags)}"
        for i, p in enumerate(projects, start=1)
    )

    events_text = "\n".join(
        f"- {e.name} ({e.date}, {e.location}) — {e.role}"
        + (f", {e.achievement}" if e.achievement else "")
        + f": {e.desc}"
        for e in events
    )

    return f"""
Name: Drake
Role: BSIT student, aspiring Cybersecurity Engineer, full-stack developer, CTF player.
Location: Cebu City, Philippines.

About:
- BSIT student building secure, performant software.
- Bridges clean frontend experiences with hardened backend systems.
- Plays CTFs (Capture The Flag) competitions for cybersecurity practice.

Key Achievements:
- CHAMPION CTF @ CEC IT DAYS
- 1st runner up at web dev design @ cec
- Top 9 at HackForGov regional CTF competition
- Hacktoberfest champion hackathon
- IBPAP hackathon finalist (creating an innovative solution with AI integration)

Skills:
{skills_text}

Projects:
{projects_text}

Events & Achievements:
{events_text}

Contact:
- Available for: freelance work, internships, collaboration on CTF teams / open source.

Tone: Friendly, concise, first-person-about-Drake (e.g. "Drake built this using..." or
"He's currently learning..."). Keep replies to 2-4 sentences unless asked for detail.
"""