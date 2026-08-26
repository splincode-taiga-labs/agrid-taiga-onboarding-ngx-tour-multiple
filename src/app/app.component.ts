import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {TuiButton, TuiRoot, TuiTitle} from '@taiga-ui/core';
import {AgGridAngular} from 'ag-grid-angular';
import {
    AllCommunityModule,
    type ColDef,
    type GridReadyEvent,
    ModuleRegistry,
} from 'ag-grid-community';
import {TourService, TourTuiHintModule} from 'ngx-ui-tour-tui-hint';

import {
    provideTravelNotesTour,
    TRAVEL_NOTES_TOUR,
} from './comments/comment-tour/comment-tour.provider';
import {TravelNotesSidebarComponent} from './comments/comments-sidebar/comments-sidebar.component';
import {TravelNotesSidebarService} from './comments/comments-sidebar/comments-sidebar.service';
import {TRAVEL_PLANS} from './data/proposals';
import {GridNavigationService} from './grid/grid-navigation.service';
import {TourHeaderComponent} from './grid/tour-header.component';
import {TravelPlanCellComponent} from './grid/travel-plan-cell.component';
import {
    provideTripPlanningTour,
    TRIP_PLANNING_TOUR,
} from './planning/planning-tour.provider';
import {TRIP_PLANNING_TOUR_ANCHORS} from './planning/planning-tour.service';
import {TravelPlanDto} from './proposal.dto';
import {AppTourTemplateComponent} from './tour-template.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'onboarding-demo',
    imports: [
        AgGridAngular,
        AppTourTemplateComponent,
        TravelNotesSidebarComponent,
        TourTuiHintModule,
        TuiButton,
        TuiRoot,
        TuiTitle,
    ],
    providers: [
        GridNavigationService,
        TravelNotesSidebarService,
        provideTravelNotesTour(),
        provideTripPlanningTour(),
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected readonly travelNotesTour = inject(TRAVEL_NOTES_TOUR);
    protected readonly tripPlanningTour = inject(TRIP_PLANNING_TOUR);
    protected readonly sidebar = inject(TravelNotesSidebarService);
    protected readonly running = signal(false);
    protected readonly rowData = TRAVEL_PLANS;

    protected readonly defaultColDef: ColDef<TravelPlanDto> = {
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 140,
    };

    protected readonly columnDefs: ColDef<TravelPlanDto>[] = [
        {
            colId: 'title',
            field: 'title',
            headerName: 'Маршрут',
            cellRenderer: TravelPlanCellComponent,
            minWidth: 300,
            flex: 1.5,
        },
        {
            field: 'country',
            headerName: 'Страна',
            headerComponent: TourHeaderComponent,
            headerComponentParams: {tourAnchor: TRIP_PLANNING_TOUR_ANCHORS.country},
            minWidth: 190,
        },
        {
            field: 'season',
            headerName: 'Сезон',
            headerComponent: TourHeaderComponent,
            headerComponentParams: {tourAnchor: TRIP_PLANNING_TOUR_ANCHORS.season},
            minWidth: 150,
        },
        {
            field: 'durationDays',
            headerName: 'Дней',
            headerComponent: TourHeaderComponent,
            headerComponentParams: {tourAnchor: TRIP_PLANNING_TOUR_ANCHORS.duration},
            minWidth: 130,
        },
        {field: 'status', headerName: 'Статус', minWidth: 170},
    ];

    private readonly navigation = inject(GridNavigationService);
    private readonly tour = inject(TourService);
    private autoStartAttempted = false;

    public constructor() {
        const travelPlan = this.rowData[0];

        if (travelPlan) {
            this.travelNotesTour?.prepare(travelPlan);
        }
    }

    protected onGridReady(event: GridReadyEvent<TravelPlanDto>): void {
        this.navigation.setGridApi(event.api);
    }

    protected onFirstDataRendered(): void {
        if (this.autoStartAttempted) {
            return;
        }

        this.autoStartAttempted = true;
        void this.startTours();
    }

    protected async startTours(ignoreCompleted = false): Promise<void> {
        if (this.running()) {
            return;
        }

        this.running.set(true);

        try {
            const travelPlan = this.rowData[0];

            if (travelPlan && this.travelNotesTour) {
                this.sidebar.close();
                this.navigation.showColumn('title');
                this.navigation.showRow(travelPlan.id);

                const result = await this.travelNotesTour.run(
                    travelPlan,
                    ignoreCompleted,
                );

                if (result === 'dismissed') {
                    return;
                }
            }

            this.sidebar.close();
            await this.tripPlanningTour?.run(ignoreCompleted);
        } finally {
            this.running.set(false);
        }
    }

    protected closeSidebar(): void {
        this.sidebar.close();

        if (this.travelNotesTour?.owns(this.tour.currentStep)) {
            this.travelNotesTour.dismiss();
        }
    }
}
