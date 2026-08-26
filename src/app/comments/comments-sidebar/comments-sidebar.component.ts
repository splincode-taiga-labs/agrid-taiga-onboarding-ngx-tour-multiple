import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiSegmented} from '@taiga-ui/kit';
import {TourAnchorTuiHintDirective} from 'ngx-ui-tour-tui-hint';

import {TravelPlanDto} from '../../proposal.dto';
import {TravelNoteFormComponent} from '../comment-form/comment-form.component';
import {TRAVEL_NOTES_TOUR} from '../comment-tour/comment-tour.provider';
import {TRAVEL_NOTES_TOUR_ANCHORS} from '../comment-tour/comment-tour.service';

@Component({
    selector: 'travel-notes-sidebar',
    imports: [TravelNoteFormComponent, TourAnchorTuiHintDirective, TuiButton, TuiSegmented],
    template: `
        <aside class="sidebar">
            <header>
                <h2>Заметки о маршруте</h2>
                <button
                    appearance="flat"
                    aria-label="Закрыть сайдбар"
                    iconStart="@tui.x"
                    size="m"
                    tuiIconButton
                    type="button"
                    (click)="closed.emit()"
                ></button>
            </header>

            <div class="summary">
                <span class="avatar">{{ travelPlan().title.slice(0, 1) }}</span>
                <div>
                    <strong>{{ travelPlan().title }}</strong>
                    <div>{{ travelPlan().country }}</div>
                </div>
            </div>

            <tui-segmented
                size="m"
                [tourAnchor]="travelNotesTour ? anchors.tabs : ''"
                [(activeItemIndex)]="activeSegment"
            >
                <button type="button">Все</button>
                <button type="button">Подготовка</button>
                <button type="button">Впечатления</button>
            </tui-segmented>

            <section class="empty">
                <div class="empty-icon">✦</div>
                <p>Заметок для этого маршрута пока нет</p>
            </section>

            <travel-note-form [travelPlan]="travelPlan()" />
        </aside>
    `,
    styles: `
        :host,
        .sidebar {
            display: block;
            block-size: 100%;
        }

        .sidebar {
            display: grid;
            grid-template-rows: auto auto auto 1fr auto;
            gap: 1rem;
            padding: 1.25rem;
            border-inline-start: 1px solid #e5e7eb;
            background: #fff;
        }

        header,
        .summary {
            display: flex;
            align-items: center;
        }

        header {
            justify-content: space-between;
        }

        h2 {
            margin: 0;
        }

        .summary {
            gap: 0.75rem;
        }

        .avatar {
            display: grid;
            place-items: center;
            inline-size: 2.5rem;
            block-size: 2.5rem;
            border-radius: 50%;
            background: #e8eefc;
            font-weight: 700;
        }

        .empty {
            display: grid;
            place-items: center;
            align-content: center;
            color: #7b8490;
            text-align: center;
        }

        .empty-icon {
            font-size: 2rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelNotesSidebarComponent {
    protected readonly travelNotesTour = inject(TRAVEL_NOTES_TOUR);
    protected readonly anchors = TRAVEL_NOTES_TOUR_ANCHORS;
    protected activeSegment = 0;

    public readonly travelPlan = input.required<TravelPlanDto>();
    public readonly closed = output<void>();
}
