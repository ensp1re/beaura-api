import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.TRANSIENT })
export class FileLogger extends ConsoleLogger {
    private logStream: fs.WriteStream | undefined;
    private currentDate: string;

    constructor() {
        super();
        console.log("FileLogger initialized"); // Debug message
        this.currentDate = this.getDateString();
        this.createLogStream();
    }

    private getDateString(): string {
        return new Date().toISOString().slice(0, 10);
    }

    private createLogStream(): void {
        const logsDir = path.resolve(__dirname, '..', 'logs');
        console.log(`Creating log directory at: ${logsDir}`);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
            console.log('Logs directory created successfully');
        }

        const filename = `app-${this.currentDate}.log`;
        this.logStream = fs.createWriteStream(path.join(logsDir, filename), {
            flags: 'a',
        });

        this.logStream.on('error', (error) => {
            console.error('Failed to write to log file:', error);
        });
        console.log('Log file stream created successfully');
    }

    private checkAndRotateLogFile(): void {
        const newDate = this.getDateString();
        if (newDate !== this.currentDate) {
            this.currentDate = newDate;
            if (this.logStream) {
                this.logStream.end();
            }
            this.createLogStream();
        }
    }

    log(message: string, context?: string): void {
        super.log(message, context);
        this.writeToFile(`LOG: ${message}`);
    }

    error(message: string, trace?: string, context?: string): void {
        super.error(message, trace, context);
        this.writeToFile(`ERROR: ${message} - TRACE: ${trace}`);
    }

    warn(message: string, context?: string): void {
        super.warn(message, context);
        this.writeToFile(`WARN: ${message}`);
    }

    private writeToFile(message: string): void {
        this.checkAndRotateLogFile();
        if (this.logStream) {
            this.logStream.write(
                `${new Date().toISOString()} - ${message}\n`,
                (error) => {
                    if (error) {
                        console.error('Error writing log message:', error);
                    }
                },
            );
        } else {
            console.error('Log stream is not initialized.');
        }
    }
}
