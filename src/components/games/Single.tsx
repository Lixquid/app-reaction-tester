import { useMemo, useState } from "preact/hooks";
import { GameProps } from "../../App";
import { ding } from "../../lib/audio";

/** A game where you respond to a single prompt as quickly as possible. */
export function Single(props: GameProps) {
    const [state, setState] = useState<
        "ready" | "waiting" | "prompt" | "tooSoon"
    >("ready");
    const [enableAudio, setEnableAudio] = useState(true);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [times, setTimes] = useState<number[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const audio = useMemo(() => new Audio(ding), []);

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
                                break;
                            case "prompt":
                                setState("ready");
                                setTimes([
                                    ...times,
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
            <div class="card-body border-top">
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="enableAudio"
                        checked={enableAudio}
                        onChange={(e) =>
                            setEnableAudio(e.currentTarget.checked)
                        }
                    />
                    <label class="form-check-label" for="enableAudio">
                        Enable audio alert
                    </label>
                </div>
            </div>
            <div class="card-body border-top">
                <div class="d-flex justify-content-between align-items-center">
                    <h3>Results</h3>
                    <button
                        class="btn btn-sm btn-outline-danger"
                        onClick={() => setTimes([])}
                        disabled={times.length === 0}
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
        </div>
    );
}
