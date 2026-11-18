import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonAccordion,
  IonAccordionGroup,
  IonCard,
  IonCardHeader,
  IonItem,
  IonList,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { finalize, from, switchMap } from 'rxjs';

import { normalizeOrder, OpenedBuyOrder } from '../../models/opened-buy-order.model';
import { OpenedBuyOrderService } from '../../opened-buy-order.service';
import {HubIconComponent} from '@daruix/hub-ui';

type OrderFilterType = '' | 'type_pc' | 'type_date';

@Component({
  selector: 'app-ordens-compra',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    IonAccordion,
    IonAccordionGroup,
    IonCard,
    IonCardHeader,
    IonItem,
    IonList,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
    IonSelect,
    IonSelectOption,
    HubIconComponent,
  ],
  templateUrl: './ordens-compra.page.html',
  styleUrl: './ordens-compra.page.scss',
})
export class OrdensCompraPage {
  private readonly service = inject(OpenedBuyOrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pdfUrls = new Set<string>();
  private pendingPopup: Window | null = null;

  readonly loading = signal(false);
  readonly error = signal('');
  readonly loaded = signal(false);
  readonly downloading = signal<string | null>(null);
  readonly pdfError = signal('');

  readonly allOrders = signal<OpenedBuyOrder[]>([]);
  readonly openedOrders = signal<OpenedBuyOrder[]>([]);
  readonly filterType = signal<OrderFilterType>('');
  readonly pcNumbersList = signal<string[]>([]);
  readonly dateList = signal<string[]>([]);

  readonly formPC = new FormGroup({
    pc_number: new FormControl('', { nonNullable: true }),
    dt_delivery: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.pendingPopup?.close();
      for (const url of this.pdfUrls) URL.revokeObjectURL(url);
    });

    this.atualizar();
  }

  atualizar(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');
    this.loaded.set(false);

    this.service
      .getOpenedBuyOrders()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (orders) => {
          const normalized = orders.map(normalizeOrder);

          this.allOrders.set(normalized);
          this.pcNumbersList.set(
            [...new Set(normalized.map((order) => order.pc_number).filter(Boolean))].sort((a, b) =>
              a.localeCompare(b, 'pt-BR', { numeric: true }),
            ),
          );
          this.dateList.set(
            [...new Set(normalized.map((order) => order.dt_delivery ?? '').filter(Boolean))].sort(
              (a, b) => this.dateSortValue(a) - this.dateSortValue(b),
            ),
          );

          this.applyFilters();
          this.loaded.set(true);
        },
        error: () => {
          this.openedOrders.set([]);
          this.loaded.set(true);
          this.error.set('Não foi possível consultar as ordens de compra. Tente novamente.');
        },
      });
  }

  applyFilters(): void {
    const pc = this.normalizePC(this.formPC.controls.pc_number.value);
    const date = this.formPC.controls.dt_delivery.value;

    this.openedOrders.set(
      this.allOrders().filter(
        (order) =>
          (!pc || this.normalizePC(order.pc_number) === pc) &&
          (!date || order.dt_delivery === date),
      ),
    );
  }

  clearFilters(): void {
    this.formPC.reset({ pc_number: '', dt_delivery: '' });
    this.filterType.set('');
    this.applyFilters();
  }

  handleChangeType(event: CustomEvent<{ value: string }>): void {
    const nextType = this.asFilterType(event.detail.value);

    this.formPC.reset({ pc_number: '', dt_delivery: '' });
    this.filterType.set(nextType);
    this.applyFilters();
  }

  handleChange(event: CustomEvent<{ value: string }>): void {
    const value = event.detail.value ?? '';

    if (this.filterType() === 'type_date') {
      this.formPC.controls.dt_delivery.setValue(value);
    } else if (this.filterType() === 'type_pc') {
      this.formPC.controls.pc_number.setValue(value);
    }

    this.applyFilters();
  }

  activeFilterOptions(): readonly string[] {
    return this.filterType() === 'type_date' ? this.dateList() : this.pcNumbersList();
  }

  selectedFilterValue(): string {
    return this.filterType() === 'type_date'
      ? this.formPC.controls.dt_delivery.value
      : this.formPC.controls.pc_number.value;
  }

  hasActiveFilter(): boolean {
    return Boolean(
      this.filterType() ||
        this.formPC.controls.pc_number.value ||
        this.formPC.controls.dt_delivery.value,
    );
  }

  clearPdfError(): void {
    this.pdfError.set('');
  }

  orderKey(order: OpenedBuyOrder): string {
    return `${order.pc_number}/${order.cod}`;
  }

  isDownloading(order: OpenedBuyOrder): boolean {
    return this.downloading() === this.orderKey(order);
  }

  formatValue(value: string | number | null): string {
    if (typeof value === 'number') {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    return value ?? '—';
  }

  downloadOC(order: OpenedBuyOrder): void {
    if (this.downloading()) return;

    this.pdfError.set('');
    this.downloading.set(this.orderKey(order));

    // O popup precisa ser criado durante o clique para não ser bloqueado
    // quando a resposta HTTP do PDF chegar.
    const popup = window.open('about:blank', '_blank');
    if (popup) popup.opener = null;
    this.pendingPopup = popup;

    this.service
      .getOCPDF(order.pc_number, order.cod)
      .pipe(
        switchMap((blob) =>
          from(
            blob
              .slice(0, 5)
              .text()
              .then((signature) => {
                if (signature !== '%PDF-') throw new Error('invalid-pdf');
                return blob;
              }),
          ),
        ),
        finalize(() => this.downloading.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (blob) => {
          try {
            const pdf = new Blob([blob], { type: 'application/pdf' });
            const url = URL.createObjectURL(pdf);
            this.pdfUrls.add(url);

            if (popup && !popup.closed) {
              popup.location.href = url;
            } else {
              const link = document.createElement('a');
              link.href = url;
              link.download = `OC-${order.pc_number}-${order.cod}.pdf`;
              link.click();
            }

            this.pendingPopup = null;
          } catch {
            popup?.close();
            this.pendingPopup = null;
            this.pdfError.set('O servidor não retornou um PDF válido.');
          }
        },
        error: (requestError: { status?: number; message?: string }) => {
          popup?.close();
          this.pendingPopup = null;
          this.pdfError.set(
            requestError.message === 'invalid-pdf'
              ? 'O servidor não retornou um PDF válido.'
              : requestError.status === 404
                ? 'PDF não encontrado.'
                : 'Não foi possível abrir o PDF. Tente novamente.',
          );
        },
      });
  }

  private normalizePC(value: string): string {
    return value.trim().toUpperCase().replace(/^PC\s*/, '');
  }

  private asFilterType(value: string | null | undefined): OrderFilterType {
    return value === 'type_pc' || value === 'type_date' ? value : '';
  }

  private dateSortValue(value: string): number {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (match) return Date.UTC(+match[3], +match[2] - 1, +match[1]);

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
  }
}
