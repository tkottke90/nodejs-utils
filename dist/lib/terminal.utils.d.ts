/**
 * Wraps the string in hash symbols and pads the text
 * to a specific size.  Text is put BEFORE the padding
 *
 * @example
 * int size = 20;
 * console.log('#'.repeat(size));
 * console.log(wrap('CLI Script', size))
 * console.log(wrap("  > test", size));
 * console.log('#'.repeat(size));
 *
 * Output:
 *
 * ####################
 * # CLI Script       #
 * #  > test          #
 * ####################
 */
export declare function wrap(input: string, size?: number): string;
/**
 * Wraps the string in hash symbols and pads the text
 * to a specific size.  Text is included AFTER the padding
 *
 * @example
 * int size = 20;
 * console.log('#'.repeat(size));
 * console.log(wrap('CLI Script', size))
 * console.log(wrap("  > test", size));
 * console.log(wrap("", size));
 * console.log(reverseWrap("v1.0.0", size));
 * console.log('#'.repeat(size));
 *
 * Output:
 *
 * ####################
 * # CLI Script       #
 * #   > test         #
 * #                  #
 * #           v1.0.0 #
 * ####################
 */
export declare function reverseWrap(input: string, size?: number): string;
interface ScriptHeaderInput {
    border?: string;
    author?: string;
    date?: string;
    version?: string;
}
/**
 * Provides a standardized output for command line
 */
export declare function drawScriptHeader(appName: string, input?: ScriptHeaderInput): void;
/**
 * Writes a string to process.stdout using a 'space-between' style display where
 * the length of the start/end string are used to calculate the padding between them
 * so that the start is left aligned and the end is right aligned
 * @example
 *
 * drawLine('Loading Databse....', 'LOADING')
 *
 * // Output (with terminal bounding box):
 * // | Loading Database...                          LOADING |
 */
export declare function drawLine(start: string, end?: string): void;
/**
 * Creates a progress bar with the given label and writes it to the terminal.
 * Use the returned function to update the progress bar.
 * @returns Curried function which can be used to update the progress bar
 * @example
 *
 * drawLine('Loading Databse....', 'LOADING')
 *
 * // Output (with terminal bounding box):
 * // | Loading Database...                          LOADING |
 */
export declare function drawProgressBar(label: string, options?: {
    size?: number;
    graphWidth?: number;
    marker?: string;
    markerSpace?: string;
}): (progress: number) => void;
/**
 * Writes a line to the console to describe a task being done by the application and returns
 * a function.  Call the returned function to update the status to the completed status
 *
 * @example
 *
 * const task = drawTask('Load Database', 'LOADING', 'DONE');
 * // Output: | Load Database                        LOADING |
 *
 * task() // <= Overwrites the original line
 * // Output: | Load Database                           DONE |
 */
export declare function drawTask(label: string, activeStatus: string, completedStatus: string): () => void;
/**
 * Extends the `#drawTask` method by accepting the activity that
 * the application is waiting on as a parameter and then automatically
 * completes the task when the function provided resolves
 *
 * [Note] - Does not work with promises
 *
 * @example
 * const dict = { complete: false }
 *
 * const updateMap = () {
 *  dict.complete = true;
 * }
 *
 * drawActivity('Update Package', updateMap)
 *
 * // Output:
 * // | Load Database                        WORKING |
 * // < Work done in updateMap fn>
 * // | Load Database                       COMPLETE |  <= Replaces the above line
 *
 */
export declare function drawActivity(label: string, activity: () => void, options?: {
    activeStatus?: string;
    completedStatus?: string;
}): void;
/**
 * Uses the drawLine method and provides trigger functions for success or failure to
 * allow you to show the result of an activity
 */
export declare function drawDecision(label: string, successStatus?: string, failureStatus?: string): {
    success: () => void;
    failure: () => void;
};
export {};
