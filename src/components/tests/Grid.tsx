import { useMemo, useState } from "preact/hooks";
import { TestProps } from "../../App";
import { ding } from "../../lib/audio";
import { ResultSection } from "../ResultSection";

/** A test where you respond to a prompt within a grid as quickly as possible. */
export function Grid(props: TestProps) {
    const [state, setState] = useState<
        "ready" | "waiting" | "prompt" | "tooSoon" | "missed"
    >("ready");
    const [results, setResults] = useState<(number | string)[]>([]);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [target, setTarget] = useState<number>(-1);
    const audio = useMemo(() => new Audio(ding), []);

    // Settings
    const [enableAudio, setEnableAudio] = useState(true);
    const [gridSize, setGridSize] = useState(16);

    return (
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <span>Grid</span>
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
                <div class="row">
                    {Array.from({ length: gridSize }).map((_, i) => (
                        <div class="col-6 col-md-4 col-lg-3 mb-4" key={i}>
                            <button
                                class={`w-100 btn btn-lg btn-${
                                    state === "prompt" && i === target
                                        ? "primary"
                                        : "secondary"
                                }`}
                                onClick={() => {
                                    switch (state) {
                                        case "waiting":
                                            setState("tooSoon");
                                            if (timeoutId)
                                                clearTimeout(timeoutId);
                                            break;
                                        case "prompt":
                                            if (i === target) {
                                                setState("ready");
                                                setResults([
                                                    ...results,
                                                    new Date().getTime() -
                                                        startTime.getTime(),
                                                ]);
                                            } else {
                                                setState("missed");
                                            }
                                            break;
                                    }
                                }}
                            >
                                &nbsp;
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    class={`btn btn-lg w-100 btn-${
                        state === "ready" ||
                        state === "tooSoon" ||
                        state === "missed"
                            ? "primary"
                            : "secondary"
                    }`}
                    onClick={() => {
                        if (
                            state === "ready" ||
                            state === "tooSoon" ||
                            state === "missed"
                        ) {
                            setState("waiting");
                            // Wait a random amount of time before prompting
                            setTimeoutId(
                                setTimeout(() => {
                                    setState("prompt");
                                    setStartTime(new Date());
                                    setTarget(
                                        Math.floor(Math.random() * gridSize)
                                    );
                                    if (enableAudio) audio.play();
                                }, Math.random() * 3000 + 1000)
                            );
                        }
                    }}
                >
                    {state === "ready"
                        ? "Start"
                        : state === "waiting"
                        ? "Wait for it..."
                        : state === "prompt"
                        ? "Click the lit button!"
                        : state === "tooSoon"
                        ? "Too soon!"
                        : state === "missed"
                        ? "Wrong button!"
                        : ""}
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
                        <label for="gridSize" class="col-form-label-sm">
                            Grid size
                        </label>
                    </div>
                    <div class="col-sm-9">
                        <input
                            type="number"
                            class="form-control"
                            id="gridSize"
                            min="2"
                            step="1"
                            value={gridSize}
                            onChange={(e) =>
                                setGridSize(parseInt(e.currentTarget.value))
                            }
                        />
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
                    to begin. After a random amount of time, a button will light
                    up and turn <span class="badge bg-primary">blue</span>.
                    Click the lit button as quickly as possible.
                </p>
                <p class="mb-0">
                    If you click the wrong button, or click too soon, you will
                    fail the test.
                </p>
            </div>
        </div>
    );
}
