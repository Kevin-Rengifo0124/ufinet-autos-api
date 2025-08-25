import { Injectable } from "@angular/core";

const TOKEN = "token";
const USER = "user";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() { }

    static saveToken(token: string): void {
        window.localStorage.removeItem(TOKEN);
        window.localStorage.setItem(TOKEN, token);
    }

    static saveUser(user: any): void {
        window.localStorage.removeItem(USER);
        window.localStorage.setItem(USER, JSON.stringify(user)); 
    }

    static getToken(): string | null {
        return window.localStorage.getItem(TOKEN);
    }

    static getUser(): any {
        const user = window.localStorage.getItem(USER);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    static isUserLoggedIn(): boolean {
        const token = this.getToken();
        const user = this.getUser();
        
        return !!(token && user);
    }

    static logout(): void {
        window.localStorage.removeItem(TOKEN);
        window.localStorage.removeItem(USER);
    }
}