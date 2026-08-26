import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton} from '@taiga-ui/core';
import {TourAnchorTuiHintDirective} from 'ngx-ui-tour-tui-hint';

import {TravelPlanDto} from '../../proposal.dto';
import {TRAVEL_NOTES_TOUR} from '../comment-tour/comment-tour.provider';
import {TRAVEL_NOTES_TOUR_ANCHORS} from '../comment-tour/comment-tour.service';

@Component({
    selector: 'travel-note-form',
    imports: [FormsModule, TourAnchorTuiHintDirective, TuiButton],
    template: `
        <form class="form" (submit)="$event.preventDefault(); submit()">
            <label>
                <span>Новая заметка</span>
                <textarea
                    name="note"
                    placeholder="Например, проверить расписание поездов"
                    [(ngModel)]="note"
                ></textarea>
            </label>

            <label class="check" [tourAnchor]="travelNotesTour ? anchors.checklist : ''">
                <input name="checklist" type="checkbox" [(ngModel)]="addToChecklist" />
                Добавить в чек-лист
            </label>

            <div class="actions">
                <button appearance="flat" size="s" tuiButton type="button" (click)="cancel()">
                    Отмена
                </button>
                <button size="s" tuiButton type="submit">Сохранить</button>
            </div>
        </form>
    `,
    styles: `
        .form,
        label {
            display: grid;
            gap: 0.5rem;
        }

        .form {
            gap: 1rem;
            padding-block-start: 1rem;
            border-block-start: 1px solid #e5e7eb;
        }

        textarea {
            min-block-size: 6rem;
            resize: vertical;
            padding: 0.75rem;
            border: 1px solid #dfe3e8;
            border-radius: 0.75rem;
            font: inherit;
        }

        .check {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelNoteFormComponent {
    protected readonly travelNotesTour = inject(TRAVEL_NOTES_TOUR);
    protected readonly anchors = TRAVEL_NOTES_TOUR_ANCHORS;
    protected note = '';
    protected addToChecklist = false;

    public readonly travelPlan = input.required<TravelPlanDto>();

    protected cancel(): void {
        this.note = '';
        this.addToChecklist = false;
    }

    protected submit(): void {
        this.note = '';
        this.addToChecklist = false;
    }
}
