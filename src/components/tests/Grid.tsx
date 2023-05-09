import { useMemo, useState } from "preact/hooks";
import { TestProps } from "../../App";
import { ding } from "../../lib/audio";

/** A test where you respond to a prompt within a grid as quickly as possible. */
export function Grid(props: TestProps) {
    const [state, setState] = useState<
        "ready" | "waiting" | "prompt" | "tooSoon" | "missed"
    >("ready");
    const [times, setTimes] = useState<number[]>([]);
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
                                                setTimes([
                                                    ...times,
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
                        <label for="gridSize" class="col-form-label">
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
            <div class="card-body border-top">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="mb-3">
                        <i class="bi-bar-chart-fill me-2"></i>
                        Results
                    </h3>
                    <button
                        class="btn btn-sm btn-outline-danger"
                        onClick={() => setTimes([])}
                    >
                        Clear
                    </button>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <table class="table table-striped table-hover border mb-0">
                            <thead>
                                <tr>
                                    <th>Attempt</th>
                                    <th>Time (ms)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {times.map((time, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div class="col-lg-6">
                        <p>
                            <strong>Best time:</strong>{" "}
                            {times.length > 0 ? Math.min(...times) : "N/A"} ms
                        </p>
                        <p>
                            <strong>Worst time:</strong>{" "}
                            {times.length > 0 ? Math.max(...times) : "N/A"} ms
                        </p>
                        <p>
                            <strong>Average time:</strong>{" "}
                            {times.length > 0
                                ? Math.round(
                                      times.reduce((a, b) => a + b) /
                                          times.length
                                  )
                                : "N/A"}{" "}
                            ms
                        </p>
                        <p>
                            <strong>Visualization:</strong>
                        </p>
                        <div class="progress position-relative">
                            {times.map((time, i) => (
                                <div
                                    class="progress-bar bg-success position-absolute h-100"
                                    role="progressbar"
                                    style={{
                                        width: "0.5em",
                                        left: `${Math.min(
                                            100,
                                            (time / 1000) * 100
                                        )}%`,
                                    }}
                                    key={i}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div class="card-body border-top">
                <h3 class="mb-3">
                    <i class="bi-info-circle-fill me-2"></i>
                    Instructions
                </h3>
                <p class="mb-0">
                    Click the Start button to begin. A random button will light
                    up after a random amount of time. Click the lit button as
                    quickly as possible.
                </p>
            </div>
        </div>
    );
}
