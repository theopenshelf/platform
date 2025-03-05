import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    loadTheme() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/theme/custom-theme.css';
        document.head.appendChild(link);
    }
} 