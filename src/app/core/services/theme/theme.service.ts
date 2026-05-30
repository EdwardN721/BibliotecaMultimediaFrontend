import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode: WritableSignal<boolean> = signal<boolean>(false);
  constructor(){
    const saveTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saveTheme === 'dark' || (!saveTheme && prefersDark)){
      this.setDarkMode(true);
    } else{
      this.setDarkMode(false);
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.isDarkMode());
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode.set(isDark);
    
    const htmlElement = document.documentElement;
    
    // 👇 Esto es todo lo que necesitamos hacer. PrimeNG y Tailwind harán el resto mágicamente 👇
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
