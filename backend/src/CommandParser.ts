export class CommandParser {
    /**
     * Basic arg parse. extracting to here as a general case to avoid cluttering the main server file.
     * @param argv
     * @param arg
     */
    static getarg(argv: string[], arg: string): string {
        if(process.argv.filter(x => x.startsWith(`${arg}=`)).length === 0)
            return '';

        return argv.filter(x => x.startsWith(`${arg}=`))[0].split('=')[1]
    }
}