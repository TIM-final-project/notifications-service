export class GenericEmailDto {
    template: string;
    subject: string;
    payload: object;
    recipients: string[]
}
