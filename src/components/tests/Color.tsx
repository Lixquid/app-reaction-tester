import { useMemo, useState } from "preact/hooks";
import { TestProps } from "../../App";
import { ding } from "../../lib/audio";
import { ResultSection } from "../ResultSection";

const colors: Record<string, string> = {
    Red: "#ff0000",
    Green: "#00ff00",
    Blue: "#0000ff",
    Yellow: "#ffff00",
    Cyan: "#00ffff",
    Pink: "#ff00ff",
};

/** A test where you respond to a prompt for a color as quickly as possible. */
export function Color(props: TestProps) {
    const [state, setState] = useState<
        "ready" | "waiting" | "prompt" | "tooSoon" | "incorrect"
    >("ready");
    const [results, setResults] = useState<(number | string)[]>([]);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [targetColor, setTargetColor] = useState<keyof typeof colors | null>(
        null
    );
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const audio = useMemo(() => new Audio(ding), []);

    // Settings
    const [enabledColors, setEnabledColors] = useState<
        Record<keyof typeof colors, boolean>
    >(
        Object.keys(colors).reduce(
            (acc, color) => ({ ...acc, [color]: true }),
            {} as any
        )
    );
    const [promptColor, setPromptColor] = useState(true);
    const [enableAudio, setEnableAudio] = useState(true);

    return (
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <span>Color</span>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                            if (timeoutId) clearTimeout(timeoutId);
                            return props.returnToMenu();
                        }}
                    >
                        Return to menu
                    </button>
                </div>
            </div>

            {/* Test */}
            <div class="card-body">
                <div class="card mb-3">
                    <div class="card-body text-center">
                        <span
                            class="display-1"
                            style={{
                                color:
                                    state === "prompt"
                                        ? Object.values(colors)[
                                              Math.floor(
                                                  Math.random() *
                                                      Object.values(colors)
                                                          .length
                                              )
                                          ]
                                        : undefined,
                            }}
                        >
                            {state === "prompt" ? targetColor : "..."}
                        </span>
                    </div>
                </div>
                <div class="row justify-content-center">
                    {Object.entries(enabledColors).map(
                        ([color, enabled]) =>
                            enabled && (
                                <div
                                    class="col-6 col-md-4 col-lg-3 mb-4"
                                    key={color}
                                >
                                    <button
                                        class="w-100 btn btn-lg btn-secondary text-dark"
                                        style={{
                                            backgroundColor: colors[color],
                                        }}
                                        onClick={() => {
                                            if (state === "prompt") {
                                                if (color === targetColor) {
                                                    setState("ready");
                                                    setResults([
                                                        ...results,
                                                        new Date().getTime() -
                                                            startTime.getTime(),
                                                    ]);
                                                } else {
                                                    setState("incorrect");
                                                    setResults([
                                                        ...results,
                                                        "X",
                                                    ]);
                                                }
                                            } else if (state === "waiting") {
                                                setState("tooSoon");
                                                setResults([...results, "X"]);
                                                if (timeoutId) {
                                                    clearTimeout(timeoutId);
                                                }
                                            }
                                        }}
                                    >
                                        {color}
                                    </button>
                                </div>
                            )
                    )}
                </div>
                <button
                    class={`btn btn-lg w-100 btn-${
                        state === "ready" ||
                        state === "tooSoon" ||
                        state === "incorrect"
                            ? "primary"
                            : "secondary"
                    }`}
                    onClick={() => {
                        switch (state) {
                            case "ready":
                            case "incorrect":
                            case "tooSoon":
                                setState("waiting");
                                // Wait for a random amount of time before prompting
                                setTimeoutId(
                                    setTimeout(() => {
                                        setState("prompt");
                                        setStartTime(new Date());
                                        setTargetColor(
                                            Object.keys(enabledColors)[
                                                Math.floor(
                                                    Math.random() *
                                                        Object.keys(
                                                            enabledColors
                                                        ).length
                                                )
                                            ] as keyof typeof colors
                                        );
                                        if (enableAudio) audio.play();
                                    }, Math.random() * 3000 + 1000)
                                );
                                break;
                        }
                    }}
                    disabled={
                        state === "waiting" ||
                        state === "prompt" ||
                        Object.keys(enabledColors).filter(
                            (color) => enabledColors[color]
                        ).length < 2
                    }
                >
                    {Object.keys(enabledColors).filter(
                        (color) => enabledColors[color]
                    ).length < 2
                        ? "Enable at least 2 colors"
                        : state === "ready"
                        ? "Start"
                        : state === "waiting"
                        ? "Wait..."
                        : state === "prompt"
                        ? "Click!"
                        : state === "tooSoon"
                        ? "Too soon!"
                        : "Incorrect!"}
                </button>
            </div>

            {/* Settings */}
            <div class="card-body border-top">
                <h3 class="mb-3">
                    <i class="bi-gear-fill me-2"></i>
                    Settings
                </h3>
                <div class="row mb-3">
                    <div class="col-sm-3">
                        <label class="form-label col-form-label-sm">
                            Enabled colors
                        </label>
                    </div>
                    <div class="col-sm-9">
                        <div
                            class="btn-group"
                            role="group"
                            aria-label="Enabled colors"
                        >
                            {Object.entries(enabledColors).map(
                                ([color, enabled]) => (
                                    <>
                                        <input
                                            type="checkbox"
                                            class="btn-check"
                                            id={`color-${color}`}
                                            checked={enabled}
                                            onChange={(e) =>
                                                setEnabledColors({
                                                    ...enabledColors,
                                                    [color]:
                                                        e.currentTarget.checked,
                                                })
                                            }
                                        />
                                        <label
                                            class="btn btn-secondary"
                                            for={`color-${color}`}
                                        >
                                            {color}
                                        </label>
                                    </>
                                )
                            )}
                        </div>
                        <div class="form-text">
                            If you suffer from a form of color vision
                            deficiency, you may want to disable colors that are
                            difficult to distinguish.
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-sm-3">
                        <label
                            class="form-label col-form-label-sm"
                            for="promptColor"
                        >
                            Prompt text color
                        </label>
                    </div>
                    <div class="col-sm-9">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="promptColor"
                                checked={promptColor}
                                onChange={(e) =>
                                    setPromptColor(e.currentTarget.checked)
                                }
                            />
                        </div>
                        <div class="form-text">
                            If enabled, the prompt text will be colored a random
                            color. Note that you still need to select the color
                            the prompt <strong>text</strong> is asking for, not
                            the color of the prompt itself!
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-3">
                        <label for="enableAudio" class="form-label">
                            Audio alert
                        </label>
                    </div>
                    <div class="col-sm-9">
                        <div class="form-check form-switch">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="enableAudio"
                                checked={enableAudio}
                                onChange={(e) =>
                                    setEnableAudio(e.currentTarget.checked)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <ResultSection results={results} setResults={setResults} />

            {/* Instructions */}
            <div class="card-body border-top">
                <h3 class="mb-3">
                    <i class="bi-info-circle-fill me-2"></i>
                    Instructions
                </h3>
                <p>
                    Click the <span class="badge bg-primary">Start</span> button
                    to begin the test. After a random amount of time, a prompt
                    for a color will appear. Click the button that is colored
                    the same as the prompt text as quickly as possible.
                </p>
                <p class="mb-0">
                    Note that if <em>Prompt text color</em> is enabled, the
                    prompt text will be colored a random color. You still need
                    to select the color the prompt <strong>text</strong> is
                    asking for, not the color of the prompt itself!
                </p>
            </div>
        </div>
    );
}
