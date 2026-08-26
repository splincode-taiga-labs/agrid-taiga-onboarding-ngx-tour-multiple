import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {type ICellRendererParams} from 'ag-grid-community';
import {TourAnchorTuiHintDirective} from 'ngx-ui-tour-tui-hint';

import {
    TRAVEL_NOTES_TOUR,
} from '../comments/comment-tour/comment-tour.provider';
import {TRAVEL_NOTES_TOUR_ANCHORS} from '../comments/comment-tour/comment-tour.service';
import {TravelNotesSidebarService} from '../comments/comments-sidebar/comments-sidebar.service';
import {TravelPlanDto} from '../proposal.dto';

@Component({
    selector: 'travel-plan-cell',
    imports: [TourAnchorTuiHintDirective, TuiButton],
    template: `
        <div class="cell">
            <span class="name">{{ travelPlan.title }}</span>

            <button
                appearance="flat"
                [attr.aria-label]="'Открыть заметки: ' + travelPlan.title"
                [tourAnchor]="travelNotesTour?.isTarget(travelPlan) ? anchors.trigger : ''"
                iconStart="@tui.message-square"
                size="xs"
                tuiIconButton
                type="button"
                (click)="sidebar.open(travelPlan)"
            ></button>
        </div>
    `,
    styles: `
        :host,
        .cell {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            inline-size: 100%;
            block-size: 100%;
        }

        .name {
            min-inline-size: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        button {
            margin-inline-start: auto;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelPlanCellComponent implements ICellRendererAngularComp {
    protected readonly travelNotesTour = inject(TRAVEL_NOTES_TOUR);
    protected readonly anchors = TRAVEL_NOTES_TOUR_ANCHORS;
    protected readonly sidebar = inject(TravelNotesSidebarService);
    protected travelPlan!: TravelPlanDto;

    public agInit(params: ICellRendererParams<TravelPlanDto>): void {
        if (params.data) {
            this.travelPlan = params.data;
        }
    }

    public refresh(params: ICellRendererParams<TravelPlanDto>): boolean {
        this.agInit(params);

        return true;
    }
}
