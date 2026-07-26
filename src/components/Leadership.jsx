import { Reveal, Stagger, StaggerItem } from "./Reveal.jsx";

const ROLES = [
  {
    title: "Tutor — Point Park University",
    desc: "Mentored students in programming, data structures, debugging, and technical problem-solving while adapting explanations to different learning styles and helping students build confidence and independence.",
    skills: ["Mentorship", "Technical Communication", "Patience", "Adaptability", "Problem-Solving"],
  },
  {
    title: "Summer Resident Assistant — Pre-College Programs",
    desc: "Supported and supervised students between the ages of 14 and 17, maintained a safe residential environment, managed night checks, organized activities, and responded calmly to student concerns and unexpected situations.",
    skills: ["Responsibility", "Decision-Making", "Conflict Management", "Organization", "Student Support"],
  },
  {
    title: "Resident Educator & Mentor",
    desc: "Guided residential students, helped resolve conflicts, supported community standards, mentored fellow student leaders, and contributed to a welcoming and well-organized residential environment.",
    skills: ["Peer Mentorship", "Conflict Resolution", "Emotional Intelligence", "Teamwork", "Community Leadership"],
  },
  {
    title: "President — International Students Club",
    desc: "Led initiatives supporting international students, coordinated events, strengthened communication between students and university resources, and helped create a more connected and inclusive campus community.",
    skills: ["Strategic Leadership", "Event Coordination", "Public Communication", "Inclusion", "Collaboration", "Community Building"],
  },
  {
    title: "Student-Athlete — Track & Field",
    wide: true,
    desc: "Balanced academics, employment, leadership responsibilities, and high-level athletic training while developing discipline, resilience, accountability, and the ability to perform consistently under pressure.",
    skills: ["Discipline", "Resilience", "Time Management", "Teamwork", "Accountability", "Performance Under Pressure"],
  },
];

export default function Leadership() {
  return (
    <section className="section" id="leadership" aria-labelledby="leadership-title">
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot" aria-hidden="true"></span>
          Leadership &amp; Involvement
        </p>
        <h2 id="leadership-title">
          Leadership developed through mentorship, community building, athletics, and
          student support.
        </h2>
        <p className="section-lede">
          The habits that make software teams work — clear communication, accountability,
          mentorship, and staying steady under pressure — were built here.
        </p>
      </Reveal>

      <Stagger className="lead-grid" gap={0.09}>
        {ROLES.map((r) => (
          <StaggerItem
            as="article"
            variant="rise"
            key={r.title}
            className={`card lead-card${r.wide ? " lead-card--wide" : ""}`}
          >
            <h3 className="lead-title">{r.title}</h3>
            <p className="lead-desc">{r.desc}</p>
            <ul className="tag-row" aria-label="Leadership skills">
              {r.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
