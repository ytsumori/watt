type Severity = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "ALERT";

type Payload = { [key: string]: any };

type LoggerArgs = { severity: Severity; isClient: boolean; message: string; payload?: Payload };
