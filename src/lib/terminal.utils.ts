import { padNumber } from './number.utils';

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
export function wrap(input: string, size = 20) {
  const padding = ' '.repeat(size - 4 - input.length);
  return `# ${input}${padding} #`;
}

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
export function reverseWrap(input: string, size = 20) {
  const padding = ' '.repeat(size - 4 - input.length);
  return `# ${padding}${input} #`;
}

interface ScriptHeaderInput {
  border?: string;
  author?: string;
  date?: string;
  version?: string;
}

/**
 * Provides a standardized output for command line
 */
export function drawScriptHeader(appName: string, input?: ScriptHeaderInput) {
  const author = input?.author ?? '';
  const version = input?.version ?? '';
  const date = input?.date ?? new Date().toLocaleDateString();
  const sizes = [
    appName.length,
    author.length,
    version.length,
    date.length
  ].sort((a, b) => (a < b ? 1 : -1));

  const headerWidth = sizes[0] + 6;
  const borderTB = (input?.border ?? '#').repeat(headerWidth);

  console.log(`${borderTB}
${wrap(appName, headerWidth)}
${wrap(version, headerWidth)}
${wrap('', headerWidth)}
${reverseWrap(author, headerWidth)}
${wrap(date, headerWidth)}
  
${borderTB}
  `);
}

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
export function drawLine(start: string, end = '') {
  const padding = ' '.repeat(
    process.stdout.columns - (start.length + end.length)
  );

  process.stdout.write(`${start}${padding}${end}`);
}

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
export function drawProgressBar(
  label: string,
  options?: {
    size?: number;
    graphWidth?: number;
    marker?: string;
    markerSpace?: string;
  }
) {
  const mergedOptions = {
    size: process.stdout.columns,
    graphWidth: 10,
    marker: '#',
    markerSpace: ' ',
    ...options
  };

  return (progress: number) => {
    if (progress > 1 || progress < 0) {
      throw new Error('Invalid progress value, needs to be between 0 and 1');
    }

    // Used to display the value of the progress bar as a percent
    const progressDisplay = padNumber(Math.round(progress * 100), 3);
    const progressSize = Math.floor(progress * mergedOptions.size);
    // Used to create the 'marker characters' in the display
    const progressMarkers = mergedOptions.marker.repeat(progressSize);
    // Used to create the 'marker space characters' in the display
    const progressSpace = mergedOptions.markerSpace.repeat(
      mergedOptions.graphWidth - progressSize
    );

    // To properly render the progress bar we overwrite the line by setting the cursor to 0,0
    // for which we need to use a carriage return `\r` once we have 100% we need to go to a new line
    const EOL_CHARACTER = progress >= 1 ? '\n' : '\r';

    const graph = ` [${progressMarkers}${progressSpace}] ${progressDisplay}% ${EOL_CHARACTER}`;

    drawLine(`${label} `, graph);
    // Example: Loading Files   [####            ] 20%
  };
}

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
export function drawTask(
  label: string,
  activeStatus: string,
  completedStatus: string
) {
  const start = `${label} `;

  drawLine(start, ` ${activeStatus} \r`);
  return () => {
    drawLine(start, ` ${completedStatus} \n`);
  };
}

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
export function drawActivity(
  label: string,
  activity: () => void,
  options?: { activeStatus?: string; completedStatus?: string }
) {
  const mergedOptions = {
    activeStatus: 'WORKING',
    completedStatus: 'COMPLETE',
    ...options
  };

  // Create the task
  const task = drawTask(
    label,
    mergedOptions.activeStatus,
    mergedOptions.completedStatus
  );

  // Execute the activity
  activity();

  // Complete the task
  task();
}

/**
 * Uses the drawLine method and provides trigger functions for success or failure to
 * allow you to show the result of an activity
 */
export function drawDecision(
  label: string,
  successStatus = 'SUCCESS',
  failureStatus = 'FAILURE'
) {
  const start = `${label}`;

  drawLine(start, ' PENDING \r');

  return {
    success: () => drawLine(start, ` ${successStatus} \n`),
    failure: () => drawLine(start, ` ${failureStatus} \n`)
  };
}
