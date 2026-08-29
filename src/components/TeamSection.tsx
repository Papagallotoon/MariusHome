import { siteConfig } from "../../config/site";
import { getTeamData } from "@/lib/team";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

function getAvatarFallback(name: string, bg: string) {
  const seed = name.split(" ")[0];
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=${bg.replace("#", "")}`;
}

export default function TeamSection() {
  const team = getTeamData();

  return (
    <section className="py-14 sm:py-20 bg-site-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <span className="kicker mb-3">La rédaction</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-site-text font-serif">
            Notre Equipe
          </h2>
          <p className="mt-4 text-text-muted max-w-xl">
            Des passionnes de decoration qui selectionnent, testent et comparent chaque produit pour vous guider dans vos choix.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-site-border">
          {team.map((member) => {
            const hasImage = member.image && member.image.length > 0;
            const avatarSrc = hasImage
              ? member.image
              : getAvatarFallback(member.name, member.gradient[0]);

            return (
              <div
                key={member.name}
                className="py-6 sm:py-0 sm:px-6 lg:px-8 sm:border-l border-site-border first:border-l-0 first:pl-0 flex flex-col items-center text-center"
              >
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <div
                    className="w-24 h-24 sm:w-20 sm:h-20 rounded-full overflow-hidden"
                    style={{
                      border: `2.5px solid ${siteConfig.colors.vivid}`,
                      background: `linear-gradient(135deg, ${member.gradient[0]}, ${member.gradient[1]})`,
                    }}
                  >
                    <img
                      src={avatarSrc}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-site-text font-serif">{member.name}</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] mt-1" style={{ color: siteConfig.colors.vivid }}>
                  {member.role}
                </p>
                <p className="text-base sm:text-sm text-text-muted mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
