import { useEffect, useState } from "react";
import { getUserTeam, type UserTeamItem } from "../../team/services/team.service";

const STATUS_LABELS: Record<number, string> = {
    0: "En proceso",
    1: "Activo",
    2: "Finalizado",
    3: "Archivado",
};

function statusLabel(status: number): string {
    return STATUS_LABELS[status] ?? `Estado ${status}`;
}

function TeamInfo({ item }: { item: UserTeamItem }) {
    const { team } = item;
    const label = statusLabel(team.status);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white font-[JetBrains_Mono,monospace]">
                        {team.name}
                    </p>
                    <p className="mt-0.5 text-xs text-white/40 font-[JetBrains_Mono,monospace]">
                        ID #{team.id}
                    </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-primary-orange/40 bg-primary-orange/10 px-2.5 py-0.5 text-[11px] font-[JetBrains_Mono,monospace] text-primary-orange">
                    <span className="relative inline-flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-orange opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-orange" />
                    </span>
                    {label}
                </span>
            </div>

            {team.cloud_repo_link ? (
                <div className="border-l border-primary-orange/30 pl-4">
                    <p className="text-[11px] uppercase tracking-wider text-white/40 font-[JetBrains_Mono,monospace]">
                        <span className="text-primary-orange">~</span> Repositorio
                    </p>
                    <a
                        href={team.cloud_repo_link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 break-all text-sm text-primary-orange transition-colors hover:text-orange-400 font-[JetBrains_Mono,monospace]"
                    >
                        {team.cloud_repo_link}
                        <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M6 3h7v7M13 3L7 9M11 9v4H3V5h4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            ) : (
                <div className="border-l border-primary-orange/30 pl-4">
                    <p className="text-[11px] uppercase tracking-wider text-white/40 font-[JetBrains_Mono,monospace]">
                        <span className="text-primary-orange">~</span> Repositorio
                    </p>
                    <p className="mt-1 text-sm text-white/30 font-[JetBrains_Mono,monospace]">Sin repositorio asignado</p>
                </div>
            )}

            {team.feedback && (
                <div className="border-l border-primary-orange/30 pl-4">
                    <p className="text-[11px] uppercase tracking-wider text-white/40 font-[JetBrains_Mono,monospace]">
                        <span className="text-primary-orange">~</span> Feedback
                    </p>
                    <p className="mt-1 text-sm text-white/70 font-[JetBrains_Mono,monospace]">{team.feedback}</p>
                </div>
            )}
        </div>
    );
}

export default function ProfileTeamCard() {
    const [items, setItems] = useState<UserTeamItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasTeam, setHasTeam] = useState(true);

    useEffect(() => {
        getUserTeam()
            .then((data) => {
                setItems(data);
                setHasTeam(data.length > 0);
            })
            .catch(() => {
                setHasTeam(false);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section
            className="flex h-full flex-col gap-4 rounded-2xl border border-gray-800/60 bg-[#141929] p-5 transition-all duration-300 hover:border-gray-700/80 md:p-6"
            aria-label="Equipo del participante"
        >
            <header className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-base text-white font-[Zen_Dots,cursive] sm:text-lg">
                        <span className="text-primary-orange">~</span> Mi Equipo
                    </h3>
                    <p className="text-xs text-white/40 font-[JetBrains_Mono,monospace]">
                        <span className="text-primary-orange">{"// "}</span>Equipo asignado en la competencia
                    </p>
                </div>
            </header>

            {loading && (
                <div className="flex flex-1 items-center justify-center py-6">
                    <svg
                        className="h-6 w-6 animate-spin text-primary-orange"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            )}

            {!loading && !hasTeam && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-8 w-8 text-white/20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    >
                        <path
                            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-sm text-white/40 font-[JetBrains_Mono,monospace]">Sin equipo asignado</p>
                    <p className="text-xs text-white/25 font-[JetBrains_Mono,monospace]">Acepta una invitación desde el panel de equipos</p>
                </div>
            )}

            {!loading && hasTeam && items.map((item) => (
                <TeamInfo key={item.team.id} item={item} />
            ))}
        </section>
    );
}
