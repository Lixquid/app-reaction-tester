import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Single } from "./components/games/Single";

/** Toggles bootstrap theme between light and dark */
function toggleDarkMode() {
    const html = document.querySelector("html");
    if (html !== null) {
        html.dataset.bsTheme =
            html.dataset.bsTheme === "dark" ? "light" : "dark";
    }
}

/** The props for a game component */
export interface GameProps {
    /** Function to return to the game selection screen */
    returnToMenu: () => void;
}

const games: Record<
    string,
    {
        /** The human-readable name of the game */
        name: string;
        /** A short description of the game */
        description: string;
        /** The component that renders the game */
        component: (props: GameProps) => JSX.Element;
    }
> = {
    single: {
        name: "Single Event",
        description:
            "Respond to a single audio/visual prompt as quickly as possible.",
        component: Single,
    },
};

export function App() {
    const [showHelp, setShowHelp] = useState(false);
    const [activeGame, setActiveGame] = useState<keyof typeof games | null>(
        null
    );

    let output: JSX.Element;
    if (activeGame) {
        const Component = games[activeGame].component;
        output = <Component returnToMenu={() => setActiveGame(null)} />;
    } else {
        // Game selection screen
        output = (
            <>
                <h2 class="mb-4 text-center">Select a test</h2>
                <div class="row">
                    {Object.entries(games).map(([key, game]) => (
                        <button
                            class="col-12 col-md-6 col-lg-4 btn btn-outline-secondary mb-3 py-3"
                            onClick={() =>
                                setActiveGame(key as keyof typeof games)
                            }
                        >
                            <h2>{game.name}</h2>
                            <p class="mb-0">{game.description}</p>
                        </button>
                    ))}
                </div>
            </>
        );
    }

    return (
        <div class="container mx-auto my-5">
            <div class="d-flex justify-content-between align-items-center flex-wrap mb-5">
                <h1>Reaction Tester</h1>
                <div>
                    <button
                        class="btn btn-outline-secondary me-2"
                        onClick={toggleDarkMode}
                        title="Toggle dark mode"
                    >
                        <i class="bi bi-moon-fill" />
                    </button>
                    <button
                        class="btn btn-info me-2"
                        onClick={() => setShowHelp(true)}
                    >
                        <i class="bi bi-question-circle me-2" />
                        Help
                    </button>
                    <a
                        href="https://lixquid.com"
                        class="btn btn-outline-primary float-end"
                    >
                        <i class="bi bi-box-arrow-up-right me-2" />
                        lixquid.com
                    </a>
                </div>
            </div>
            {output}
        </div>
    );
}
