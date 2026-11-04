SKILLS = {
    "Development": [
        "Python", "C++", "C", "C#", "Java", "JavaScript",
        "HTML", "CSS", "React.js", "Tailwind CSS", "Vue.js",
        "Bootstrap", "ASP.NET", "PHP", "MySQL", "PostgreSQL",
        "FastAPI", "SQLite", "Firebase", "Docker", "AWS", "Git",
        "Postman", "GitHub", "Linux", "Bash", "TypeScript",
    ],
    "Cybersecurity": [
        "Nmap", "Burp Suite", "Wireshark", "Hydra",
        "Gobuster", "ffuf", "John the Ripper", "Metasploit",
    ],
}


def _icons(*pairs: tuple[str, str]) -> list[dict]:
    return [{"name": name, "label": label} for name, label in pairs]


SKILL_CATEGORIES = [
    {"title": "Languages", "type": "icons", "items": _icons(
        ("python", "Python"), ("cpp", "C++"), ("c", "C"), ("cs", "C#"), ("java", "Java"),
        ("js", "JavaScript"), ("ts", "TypeScript"), ("php", "PHP"), ("bash", "Bash"),
    )},
    {"title": "Frontend", "type": "icons", "items": _icons(
        ("html", "HTML"), ("css", "CSS"), ("react", "React"), ("vue", "Vue.js"),
        ("tailwind", "Tailwind CSS"), ("bootstrap", "Bootstrap"),
    )},
    {"title": "Mobile", "type": "badges", "items": [
        {"name": "react-native", "label": "React Native", "color": "#20232A", "text_color": "#61DAFB"},
        {"name": "expo", "label": "Expo", "color": "#000020", "text_color": "#FFFFFF"},
    ]},
    {"title": "Backend", "type": "icons", "items": _icons(
        ("fastapi", "FastAPI"), ("django", "Django"), ("flask", "Flask"),
        ("laravel", "Laravel"), ("dotnet", ".NET"),
    )},
    {"title": "Databases", "type": "icons", "items": _icons(
        ("mysql", "MySQL"), ("postgres", "PostgreSQL"), ("sqlite", "SQLite"),
        ("firebase", "Firebase"), ("redis", "Redis"), ("supabase", "Supabase"),
    )},
    {"title": "Infra and cloud", "type": "icons", "items": _icons(
        ("docker", "Docker"), ("aws", "AWS"),
    )},
    {"title": "Dev tools", "type": "icons", "items": _icons(
        ("git", "Git"), ("github", "GitHub"), ("postman", "Postman"), ("figma", "Figma"),
    )},
    {"title": "Operating systems", "type": "icons", "items": _icons(
        ("ubuntu", "Ubuntu"), ("arch", "Arch Linux"), ("kali", "Kali Linux"),
    )},
]

SECURITY_TOOLS = [
    {"name": "NMAP", "color": "#004B87"},
    {"name": "ZENMAP", "color": "#004B87"},
    {"name": "BURP SUITE", "color": "#FF6633"},
    {"name": "OWASP ZAP", "color": "#00549E"},
    {"name": "WIRESHARK", "color": "#1679A7"},
    {"name": "HYDRA", "color": "#000000"},
    {"name": "GOBUSTER", "color": "#003B6F"},
    {"name": "FFUF", "color": "#00457E"},
    {"name": "JOHN THE RIPPER", "color": "#8B0000"},
    {"name": "METASPLOIT", "color": "#2C2C2C"},
    {"name": "SQLMAP", "color": "#CC0000"},
]
