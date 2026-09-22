import { Icon } from "@/ui/Icon"
import { RichText, type RichTextRules } from "@/ui/RichText"
import type { ProfileData } from "@/lib/site"

interface ProfileSectionsProps {
  profile: ProfileData
  richTextRules: RichTextRules
}

function BioSection({
  bio,
  richTextRules
}: {
  bio: string
  richTextRules: RichTextRules
}) {
  if (!bio) return null

  return (
    <section className="profile-section profile-bio">
      <h2 className="profile-heading">bio</h2>

      <div className="profile-bio-body">
        <RichText text={bio} rules={richTextRules} />
      </div>
    </section>
  )
}

function StackSection({ stack }: Pick<ProfileData, "stack">) {
  if (stack.length === 0) return null

  return (
    <section className="profile-section profile-stack">
      <h2 className="profile-heading">stack</h2>

      <ul className="stack-badges">
        {stack.map((badge) => (
          <li key={badge.name} className="stack-badge">
            <span className="stack-badge-name">{badge.name}</span>

            {badge.version ? (
              <span className="stack-badge-version">{badge.version}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function statusClass(status: string): string {
  return status.trim().toLowerCase() === "active"
    ? "stamp-open"
    : "stamp-closed"
}

function ProjectsSection({ projects }: Pick<ProfileData, "projects">) {
  if (projects.length === 0) return null

  return (
    <section className="profile-section profile-projects">
      <h2 className="profile-heading">projects</h2>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.name} className="project-item">
            <div className="project-head">
              <h3 className="project-name">{project.name}</h3>

              {project.status ? (
                <span className={`stamp ${statusClass(project.status)}`}>
                  {project.status}
                </span>
              ) : null}
            </div>

            {project.blurb ? (
              <p className="project-blurb">{project.blurb}</p>
            ) : null}

            {project.url ? (
              <a
                href={project.url}
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  name="chevrons-right"
                  size={12}
                  className="project-link-marker"
                />

                <span className="project-link-url">{project.url}</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ProfileSections({
  profile,
  richTextRules
}: ProfileSectionsProps) {
  const empty =
    !profile.bio && profile.stack.length === 0 && profile.projects.length === 0

  if (empty) {
    return (
      <section className="profile-body profile-body-empty">
        <p className="profile-empty-note">the profile is empty</p>
      </section>
    )
  }

  return (
    <div className="profile-body">
      <BioSection bio={profile.bio} richTextRules={richTextRules} />

      <StackSection stack={profile.stack} />

      <ProjectsSection projects={profile.projects} />
    </div>
  )
}
