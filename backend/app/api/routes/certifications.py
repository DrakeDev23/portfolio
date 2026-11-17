from fastapi import APIRouter

router = APIRouter()

CERTIFICATIONS = [
    {
        "id": "cyber-data-defense",
        "name": "Cybersecurity: Turning Data into Defense",
        "issuer": "Security Analytics & Threat Defense",
        "type": "Certificate",
        "status": "completed",
    },
    {
        "id": "beyond-the-firewall",
        "name": "Beyond the Firewall",
        "issuer": "RivanIT Cebu · Network Defense",
        "type": "Security Workshop",
        "status": "completed",
    },
    {
        "id": "intro-cyber",
        "name": "Introduction to Cybersecurity",
        "issuer": "Cisco Networking Academy",
        "type": "Course Certificate",
        "status": "completed",
    },
    {
        "id": "fcc-python",
        "name": "Python Developer Certification",
        "issuer": "freeCodeCamp",
        "type": "Course Certificate",
        "status": "completed",
    },
    {
        "id": "apex-appsec",
        "name": "APEX (AppSec Professionals EXchange)",
        "issuer": "Application Security Conference & Community",
        "type": "AppSec Summit",
        "status": "completed",
    },
    {
        "id": "into-cloud-aws",
        "name": "Into the Cloud: About AWS",
        "issuer": "Cloud Computing & AWS Architecture",
        "type": "Cloud Training",
        "status": "completed",
    },
    {
        "id": "ai-career",
        "name": "Exploring Career Paths in the AI Space",
        "issuer": "Artificial Intelligence & Career Summit",
        "type": "AI Seminar",
        "status": "completed",
    },
]


@router.get("")
def get_certifications():
    return CERTIFICATIONS
