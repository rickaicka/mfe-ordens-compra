import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { OpenedBuyOrderService } from '../../opened-buy-order.service';

@Component({
  selector: 'app-ordens-compra',
  standalone: true,
  templateUrl: './ordens-compra.page.html',
  styleUrl: './ordens-compra.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdensCompraPage {
  private readonly service = inject(OpenedBuyOrderService);
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly loaded = signal(false);

  constructor() { this.atualizar(); }

  atualizar(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(false);
    this.loaded.set(false);
    this.service.getOpenedBuyOrders().pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.loaded.set(true),
      error: () => this.error.set(true),
    });
  }
}
