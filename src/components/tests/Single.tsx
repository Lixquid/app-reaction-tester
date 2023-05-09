import { useMemo, useState } from "preact/hooks";
import { TestProps } from "../../App";
import { ding } from "../../lib/audio";
import { ResultSection } from "../ResultSection";

/** A test where you respond to a single prompt as quickly as possible. */
export function Single(props: TestProps) {
    const [state, setState] = useState<
        "ready" | "waiting" | "prompt" | "tooSoon"
    >("ready");
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [results, setResults] = useState<(number | string)[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const audio = useMemo(() => new Audio(ding), []);

    // Settings
    const [enableAudio, setEnableAudio] = useState(true);

    return (
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <span>Single Event</span>
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
                <button
                    class={
                        "btn btn-lg w-100 btn-" +
                        (state === "ready" || state === "tooSoon"
                            ? "primary"
                            : state === "waiting"
                            ? "secondary"
                            : "success")
                    }
                    style={{
                        height: "10rem",
                    }}
                    onClick={() => {
                        switch (state) {
                            case "ready":
                            case "tooSoon":
                                setState("waiting");
                                // Wait a random amount of time before prompting
                                setTimeoutId(
                                    setTimeout(() => {
                                        setState("prompt");
                                        setStartTime(new Date());
                                        if (enableAudio) audio.play();
                                    }, Math.random() * 3000 + 1000)
                                );
                                break;
                            case "waiting":
                                setState("tooSoon");
                                // Cancel the timeout
                                if (timeoutId) clearTimeout(timeoutId);
                                // Add a failed attempt
                                setResults([...results, "X"]);
                                break;
                            case "prompt":
                                setState("ready");
                                setResults([
                                    ...results,
                                    new Date().getTime() - startTime.getTime(),
                                ]);
                                break;
                        }
                    }}
                >
                    {state === "ready"
                        ? "Click to start"
                        : state === "waiting"
                        ? "Wait for it..."
                        : state === "prompt"
                        ? "Now!"
                        : "Too soon!"}
                </button>
            </div>

            {/* Settings */}
            <div class="card-body border-top">
                <h3 class="mb-3">
                    <i class="bi-gear-fill me-2"></i>
                    Settings
                </h3>
                <div class="row">
                    <div class="col-sm-3">
                        <label for="enableAudio">Audio Alert</label>
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
                    Click the large <span class="badge bg-primary">start</span>{" "}
                    button to begin the test. After a random amount of time, the
                    button will turn <span class="badge bg-success">green</span>{" "}
                    and say "Now!". Click the button as quickly as possible.
                </p>
                <p class="mb-0">
                    If you click the button before it turns green, it will count
                    as a failed attempt.
                </p>
            </div>
        </div>
    );
}
