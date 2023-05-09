import { useMemo } from "preact/hooks";

/** Returns the array filtered to only include numbers */
function filterNumbers(arr: (number | string)[]): number[] {
    return arr.filter((r) => typeof r === "number") as number[];
}

/** Props for the ResultSection component */
interface ResultSectionProps {
    /** The results of the test.
     * String values are used to indicate test failures.
     */
    results: (number | string)[];
    /** Function to set the results */
    setResults: (results: (number | string)[]) => void;
}

/** A results section for a test, with table and aggregate statistics */
export function ResultSection(props: ResultSectionProps) {
    const numResults = useMemo(
        () => filterNumbers(props.results),
        [props.results]
    );

    return (
        <div class="card-body border-top">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">
                    <i class="bi-bar-chart-fill me-2"></i>
                    Results
                </h3>
                <button
                    class="btn btn-sm btn-outline-danger"
                    onClick={() => props.setResults([])}
                    disabled={props.results.length === 0}
                >
                    Clear
                </button>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <table class="table table-striped table-sm table-hover border mb-0">
                        <thead>
                            <tr>
                                <th>Attempt</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.results.map((result, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {typeof result === "number"
                                            ? result + " ms"
                                            : result}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div class="col-lg-6">
                    <p>
                        <strong>Best time:</strong>{" "}
                        {numResults.length > 0
                            ? Math.min(...numResults) + " ms"
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Worst time:</strong>{" "}
                        {numResults.length > 0
                            ? Math.max(...numResults) + " ms"
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Average time:</strong>{" "}
                        {numResults.length > 0
                            ? Math.round(
                                  numResults.reduce((a, b) => a + b) /
                                      numResults.length
                              ) + " ms"
                            : "N/A"}
                    </p>
                    <p>
                        <strong>Accuracy:</strong>{" "}
                        {props.results.length > 0
                            ? numResults.length +
                              "/" +
                              props.results.length +
                              " (" +
                              Math.round(
                                  (numResults.length / props.results.length) *
                                      100
                              ) +
                              "%)"
                            : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
}
