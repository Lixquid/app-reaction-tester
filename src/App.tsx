import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Grid } from "./components/tests/Grid";
import { Single } from "./components/tests/Single";

/** Toggles bootstrap theme between light and dark */
function toggleDarkMode() {
    const html = document.querySelector("html");
    if (html !== null) {
        html.dataset.bsTheme =
            html.dataset.bsTheme === "dark" ? "light" : "dark";
    }
}

/** The props for a test component */
export interface TestProps {
    /** Function to return to the test selection screen */
    returnToMenu: () => void;
}

const tests: Record<
    string,
    {
        /** The human-readable name of the test */
        name: string;
        /** A short description of the test */
        description: string;
        /** The component that renders the test */
        component: (props: TestProps) => JSX.Element;
    }
> = {
    single: {
        name: "Single Event",
        description:
            "Respond to a single audio/visual prompt as quickly as possible.",
        component: Single,
    },
    grid: {
        name: "Grid",
        description:
            "Respond to a prompt within a grid of options as quickly as possible.",
        component: Grid,
    },
};

export function App() {
    const [showHelp, setShowHelp] = useState(false);
    const [activeTest, setActiveTest] = useState<keyof typeof tests | null>(
        null
    );

    let output: JSX.Element;
    if (activeTest) {
        const Component = tests[activeTest].component;
        output = <Component returnToMenu={() => setActiveTest(null)} />;
    } else {
        // Game selection screen
        output = (
            <>
                <h2 class="mb-4 text-center">Select a test</h2>
                <div class="row">
                    {Object.entries(tests).map(([key, test]) => (
                        <button
                            class="col-12 col-md-6 col-lg-4 btn btn-outline-secondary mb-3 py-3"
                            onClick={() =>
                                setActiveTest(key as keyof typeof tests)
                            }
                        >
                            <h2>{test.name}</h2>
                            <p class="mb-0">{test.description}</p>
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
