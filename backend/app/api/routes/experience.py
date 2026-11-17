from fastapi import APIRouter

router = APIRouter()

EXPERIENCE = [
    {
        "id": 1,
        "title": "Founding Software Engineer",
        "company": "Pterano",
        "type": "Startup",
        "location": "Cebu, Philippines",
        "duration": "Jun 21, 2026 – Present",
        "description": "Helping establish the technical foundation of an early-stage startup through software architecture, backend engineering, full-stack development, and technical implementation.",
        "highlights": [
            "Software Architecture",
            "Backend Engineering",
            "Full-Stack Development",
            "Database Design",
        ],
    },
    {
        "id": 2,
        "title": "Full-Stack Developer",
        "company": "Freelance / Self-Employed",
        "type": "Freelance",
        "location": "Cebu, Philippines",
        "duration": "Present",
        "description": "Developing full-stack applications with a focus on backend engineering, database architecture, API development, application integration, and deployment.",
        "highlights": [
            "Full-Stack Development",
            "Backend Development",
            "API Development",
            "Database Design",
            "Application Deployment",
        ],
    },
    {
        "id": 3,
        "title": "Student Security Researcher",
        "company": "Independent Research",
        "type": "Research",
        "location": "Cebu, Philippines",
        "duration": "Present",
        "description": "Conducting authorized security assessments and application security research, focusing on identifying vulnerabilities, evaluating security controls, and assessing the security of web applications, APIs, and network infrastructure.",
        "highlights": [
            "Web Application Penetration Testing",
            "API Penetration Testing",
            "Network Penetration Testing",
            "Application Security Research",
            "Vulnerability Assessment & Analysis",
            "Open-Source Intelligence (OSINT)",
        ],
    },
]


@router.get("")
def get_experience():
    return EXPERIENCE
