import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {WA_LOCAL_STORAGE} from '@ng-web-apis/common';
import {type IStepOption, TourService} from 'ngx-ui-tour-tui-hint';

import {TravelPlanDto} from '../../proposal.dto';
import {type TourResult} from '../../tour-result';
import {TravelNotesSidebarService} from '../comments-sidebar/comments-sidebar.service';

export const TRAVEL_NOTES_TOUR_ANCHORS = {
    trigger: 'travel-notes-trigger',
    tabs: 'travel-notes-tabs',
    checklist: 'travel-notes-checklist',
} as const;

export const TRAVEL_NOTES_TOUR_STEPS = {
    trigger: 'travel-notes-trigger-step',
    tabs: 'travel-notes-tabs-step',
    checklist: 'travel-notes-checklist-step',
} as const;

const STORAGE_KEY = '@onboarding.travel-notes.v1';
const COMPLETED_STATE = 'completed';

const STEPS: IStepOption[] = [
    {
        stepId: TRAVEL_NOTES_TOUR_STEPS.trigger,
        anchorId: TRAVEL_NOTES_TOUR_ANCHORS.trigger,
        placement: 'right',
        enableBackdrop: true,
    },
    {
        stepId: TRAVEL_NOTES_TOUR_STEPS.tabs,
        anchorId: TRAVEL_NOTES_TOUR_ANCHORS.tabs,
        placement: 'left',
        enableBackdrop: true,
        isAsync: true,
    },
    {
        stepId: TRAVEL_NOTES_TOUR_STEPS.checklist,
        anchorId: TRAVEL_NOTES_TOUR_ANCHORS.checklist,
        placement: 'left',
        enableBackdrop: true,
        isAsync: true,
    },
];

@Injectable()
export class TravelNotesTourService {
    private readonly localStorage = inject(WA_LOCAL_STORAGE);
    private readonly sidebar = inject(TravelNotesSidebarService);
    private readonly tour = inject(TourService);
    private readonly targetTravelPlan = signal<TravelPlanDto | null>(null);
    private resolveRun: ((result: TourResult) => void) | null = null;

    public constructor() {
        this.tour.end$
            .pipe(takeUntilDestroyed(inject(DestroyRef)))
            .subscribe(() => this.finishFromExternalEnd());
    }

    public prepare(travelPlan: TravelPlanDto): void {
        this.targetTravelPlan.set(travelPlan);
    }

    public run(travelPlan: TravelPlanDto, ignoreCompleted = false): Promise<TourResult> {
        if (
            !ignoreCompleted &&
            this.localStorage.getItem(STORAGE_KEY) === COMPLETED_STATE
        ) {
            return Promise.resolve('skipped');
        }

        if (this.tour.currentStep) {
            this.tour.end();
        }

        this.targetTravelPlan.set(travelPlan);
        this.tour.initialize(STEPS, {
            disablePageScrolling: true,
            showProgress: false,
            stepDimensions: {
                width: 'min(29rem, calc(100vw - 1rem))',
                maxWidth: 'calc(100vw - 1rem)',
            },
        });

        return new Promise<TourResult>((resolve) => {
            this.resolveRun = resolve;
            this.tour.start();
        });
    }

    public isTarget(travelPlan: TravelPlanDto): boolean {
        return this.targetTravelPlan()?.id === travelPlan.id;
    }

    public owns(step: IStepOption | undefined): boolean {
        return !!step && Object.values(TRAVEL_NOTES_TOUR_STEPS).includes(
            step.stepId as (typeof TRAVEL_NOTES_TOUR_STEPS)[keyof typeof TRAVEL_NOTES_TOUR_STEPS],
        );
    }

    public next(): void {
        if (this.tour.currentStep?.stepId === TRAVEL_NOTES_TOUR_STEPS.trigger) {
            const travelPlan = this.targetTravelPlan();

            if (travelPlan) {
                this.sidebar.open(travelPlan);
            }
        }

        this.tour.next();
    }

    public complete(): void {
        this.finish('completed');
    }

    public dismiss(): void {
        this.finish('dismissed');
    }

    private finish(result: Exclude<TourResult, 'skipped'>): void {
        const resolve = this.resolveRun;

        if (!resolve) {
            return;
        }

        this.resolveRun = null;
        this.localStorage.setItem(STORAGE_KEY, COMPLETED_STATE);
        this.tour.end();
        resolve(result);
    }

    private finishFromExternalEnd(): void {
        const resolve = this.resolveRun;

        if (!resolve) {
            return;
        }

        this.resolveRun = null;
        this.localStorage.setItem(STORAGE_KEY, COMPLETED_STATE);
        resolve('dismissed');
    }
}
