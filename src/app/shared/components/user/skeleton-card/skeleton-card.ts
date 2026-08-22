import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="aspect-[2/3] rounded-lg bg-zinc-800/80 animate-pulse"></div>
  `,
})
export class SkeletonCard {}
